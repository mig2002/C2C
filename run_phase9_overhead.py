import os
import sys
import time
import json
import torch
import numpy as np
import pandas as pd

sys.path.insert(0, os.path.abspath("."))

from utils.logger import get_logger
from security.stage_j_runner import run_stage_j_experiment

logger = get_logger("Phase9_Overhead")

def run_phase9_overhead(seed: int = 1, rounds: int = 3, device: str = "cuda"):
    logger.info("=" * 90)
    logger.info(f"   PHASE 9: COMPUTATIONAL & COMMUNICATION OVERHEAD PROFILING (Rounds={rounds})")
    logger.info("=" * 90)

    output_dir = "results/final_stage_j/overhead"
    os.makedirs(output_dir, exist_ok=True)
    dev_type = "cuda" if (device == "cuda" and torch.cuda.is_available()) else "cpu"

    methods = [
        ("Standard FedAvg", "fedavg", False),
        ("Original FedXAI", "fedavg", True),   # Runs SHAP logging on server/clients
        ("Proposed Trustworthy FedXAI", "temporal_trust", True)
    ]

    overhead_records = []
    t_start = time.time()

    for disp_name, agg_key, compute_shap in methods:
        logger.info(f"\nProfiling Method: [{disp_name}]...")
        if torch.cuda.is_available():
            torch.cuda.reset_peak_memory_stats()

        exp_id = f"overhead_{agg_key}_{'shap' if compute_shap else 'noshap'}_seed{seed}"
        res = run_stage_j_experiment(
            experiment_id=exp_id,
            attack_type="none",
            aggregation_method=agg_key,
            malicious_ratio=0.0,
            seed=seed,
            num_rounds=rounds,
            device=dev_type,
            phase="PHASE_9_OVERHEAD",
            save_results_dir=output_dir
        )

        ov = res["overhead"]
        rounds_data = res["rounds"]

        # Memory usage in MB
        if torch.cuda.is_available():
            peak_gpu_mem_mb = float(torch.cuda.max_memory_allocated() / (1024 * 1024))
        else:
            peak_gpu_mem_mb = 0.0

        # Timing averages per round
        avg_train_time = ov["total_training_time"] / rounds
        avg_shap_time = ov["total_shap_time"] / rounds if compute_shap else 0.0
        avg_mt_time = ov["total_model_trust_time"] / rounds
        avg_et_time = ov["total_expl_trust_time"] / rounds
        avg_tt_time = ov["total_temp_trust_time"] / rounds
        avg_agg_time = ov["total_agg_time"] / rounds
        avg_round_time = ov["total_experiment_time"] / rounds

        # Communication volume per round in KB
        # FedAvg: 9 clients upload model + 9 clients download model
        # Proposed: 9 clients upload model + 9 clients upload SHAP vector + 9 clients download model
        comm_kb_per_round = ov["avg_round_comm_bytes"] / 1024.0
        comm_total_kb = ov["total_comm_bytes"] / 1024.0

        record = {
            "method": disp_name,
            "aggregation_key": agg_key,
            "avg_training_time_s": avg_train_time,
            "avg_shap_time_s": avg_shap_time,
            "avg_model_trust_time_s": avg_mt_time,
            "avg_expl_trust_time_s": avg_et_time,
            "avg_temporal_trust_time_s": avg_tt_time,
            "avg_aggregation_time_s": avg_agg_time,
            "avg_total_round_time_s": avg_round_time,
            "total_experiment_time_s": ov["total_experiment_time"],
            "comm_per_round_kb": comm_kb_per_round,
            "total_comm_kb": comm_total_kb,
            "model_size_kb": ov["model_update_size_bytes"] / 1024.0,
            "explanation_size_bytes": ov["explanation_vector_size_bytes"],
            "peak_gpu_mem_mb": peak_gpu_mem_mb
        }
        overhead_records.append(record)

    total_time = time.time() - t_start

    # Save summary dataframe
    df_ov = pd.DataFrame(overhead_records)
    summary_csv = os.path.join(output_dir, f"overhead_analysis_seed{seed}.csv")
    df_ov.to_csv(summary_csv, index=False)

    summary_json = os.path.join(output_dir, f"overhead_analysis_seed{seed}.json")
    with open(summary_json, "w", encoding="utf-8") as f:
        json.dump(overhead_records, f, indent=2)

    # Print Table
    print("\n" + "=" * 125)
    print("   PHASE 9: COMPUTATIONAL & COMMUNICATION OVERHEAD PROFILING RESULTS")
    print("=" * 125)
    fmt = "{:<28} {:<12} {:<12} {:<12} {:<12} {:<12} {:<14} {:<12}"
    print(fmt.format("Method", "Train(s)", "SHAP(s)", "Trust(s)", "Agg(s)", "Round(s)", "Comm/Rnd(KB)", "GPU Mem(MB)"))
    print("-" * 125)
    for r in overhead_records:
        trust_time = r["avg_model_trust_time_s"] + r["avg_expl_trust_time_s"] + r["avg_temporal_trust_time_s"]
        print(fmt.format(
            r["method"],
            f"{r['avg_training_time_s']:.2f}s",
            f"{r['avg_shap_time_s']:.2f}s",
            f"{trust_time:.3f}s",
            f"{r['avg_aggregation_time_s']*1000:.1f}ms",
            f"{r['avg_total_round_time_s']:.2f}s",
            f"{r['comm_per_round_kb']:.1f} KB",
            f"{r['peak_gpu_mem_mb']:.1f} MB"
        ))
    print("-" * 125)
    print(f"Model Update Size: {overhead_records[0]['model_size_kb']:.2f} KB | Explanation Vector: {overhead_records[0]['explanation_size_bytes']} bytes")
    print(f"Total Phase 9 Execution Runtime: {total_time:.2f} seconds.")
    print(f"Saved results to: {summary_csv}")
    print("=" * 125 + "\n")

    return overhead_records

if __name__ == "__main__":
    run_phase9_overhead()
