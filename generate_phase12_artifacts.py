import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sys.path.insert(0, os.path.abspath("."))
from utils.logger import get_logger

logger = get_logger("Phase12_Artifacts")

sns.set_theme(style="whitegrid", font_scale=1.05)
plt.rcParams["font.sans-serif"] = "DejaVu Sans"
plt.rcParams["axes.edgecolor"] = "#333333"
plt.rcParams["axes.linewidth"] = 1.0


def generate_tables(output_dir="results/final_stage_j/tables"):
    os.makedirs(output_dir, exist_ok=True)
    logger.info("Generating Publication Tables 1 through 8...")

    # Load multi-seed stats
    ms_stats_path = "results/final_stage_j/multiseed/multiseed_statistical_summary.csv"
    df_ms = pd.read_csv(ms_stats_path) if os.path.exists(ms_stats_path) else None

    # ----------------------------------------------------
    # TABLE 1: Overall Baseline Comparison (Clean Benchmark)
    # ----------------------------------------------------
    base_path = "results/final_stage_j/baselines/baseline_comparison_seed1.csv"
    if os.path.exists(base_path):
        df_base = pd.read_csv(base_path)
        table1 = df_base[["method", "accuracy", "precision", "recall", "f1", "fpr", "roc_auc", "runtime_s"]].copy()
        table1.columns = ["Method", "Accuracy", "Precision", "Recall", "F1 Score", "FPR", "ROC-AUC", "Runtime (s)"]
        table1.to_csv(os.path.join(output_dir, "table1_overall_baseline_comparison.csv"), index=False)
        logger.info("  [SAVED] Table 1: Overall Baseline Comparison")

    # ----------------------------------------------------
    # TABLE 2: Security Attack Comparison (Across Attacks)
    # ----------------------------------------------------
    sec_path = "results/final_stage_j/security/security_benchmark_seed1.csv"
    if os.path.exists(sec_path):
        df_sec = pd.read_csv(sec_path)
        rep_methods = ["FedAvg", "Coordinate Median", "Trimmed Mean", "Multi-Krum", "FLTrust", "Proposed (Temporal-Trust)"]
        df_sec_sub = df_sec[df_sec["defense_method"].isin(rep_methods)].copy()
        table2 = df_sec_sub.pivot(index="attack_type", columns="defense_method", values="f1")
        table2.to_csv(os.path.join(output_dir, "table2_security_attack_comparison.csv"))
        logger.info("  [SAVED] Table 2: Security Attack Comparison")

    # ----------------------------------------------------
    # TABLE 3: Non-IID Skew Comparison (Alpha Dirichlet)
    # ----------------------------------------------------
    non_iid_path = "results/final_stage_j/non_iid/non_iid_benchmark_seed1.csv"
    if os.path.exists(non_iid_path):
        df_non_iid = pd.read_csv(non_iid_path)
        table3 = df_non_iid[["alpha", "method", "accuracy", "f1", "trust_gap", "malicious_aggregation_weight"]].copy()
        table3.columns = ["Dirichlet Alpha", "Method", "Accuracy", "F1 Score", "Trust Gap", "Malicious Weight"]
        table3.to_csv(os.path.join(output_dir, "table3_non_iid_comparison.csv"), index=False)
        logger.info("  [SAVED] Table 3: Non-IID Comparison")

    # ----------------------------------------------------
    # TABLE 4: Differential Privacy Tradeoff
    # ----------------------------------------------------
    dp_path = "results/final_stage_j/differential_privacy/dp_benchmark_seed1.csv"
    if os.path.exists(dp_path):
        df_dp = pd.read_csv(dp_path)
        table4 = df_dp[["epsilon_target", "epsilon_realized_rdp", "accuracy", "f1", "shap_similarity", "trust_gap", "malicious_aggregation_weight"]].copy()
        table4.columns = ["Target Epsilon", "Realized RDP Epsilon", "Accuracy", "F1 Score", "SHAP Similarity", "Trust Gap", "Malicious Weight"]
        table4.to_csv(os.path.join(output_dir, "table4_differential_privacy_tradeoff.csv"), index=False)
        logger.info("  [SAVED] Table 4: Differential Privacy Tradeoff")

    # ----------------------------------------------------
    # TABLE 5: Component Ablation Study
    # ----------------------------------------------------
    abl_path = "results/final_stage_j/ablation/ablation_study_seed1.csv"
    if os.path.exists(abl_path):
        df_abl = pd.read_csv(abl_path)
        table5 = df_abl[["config_id", "configuration", "accuracy", "f1", "malicious_detection_rate", "trust_gap", "malicious_aggregation_weight"]].copy()
        table5.columns = ["Stage ID", "Configuration", "Accuracy", "F1 Score", "Detection Recall", "Trust Gap", "Malicious Weight"]
        table5.to_csv(os.path.join(output_dir, "table5_ablation_study.csv"), index=False)
        logger.info("  [SAVED] Table 5: Component Ablation Study")

    # ----------------------------------------------------
    # TABLE 6: Robust Aggregation Comparison (Model Poisoning Multi-Seed)
    # ----------------------------------------------------
    if df_ms is not None:
        df_ms_pois = df_ms[df_ms["benchmark"] == "Model Poisoning"].copy()
        table6 = df_ms_pois[["method", "accuracy_mean", "accuracy_std", "f1_mean", "f1_std", "mal_weight_mean", "mal_weight_std", "trust_gap_mean", "trust_gap_std"]].copy()
        table6.columns = ["Method", "Accuracy Mean", "Accuracy Std", "F1 Mean", "F1 Std", "Mal Weight Mean", "Mal Weight Std", "Trust Gap Mean", "Trust Gap Std"]
        table6.to_csv(os.path.join(output_dir, "table6_robust_aggregation_comparison.csv"), index=False)
        logger.info("  [SAVED] Table 6: Robust Aggregation Comparison (Multi-Seed)")

    # ----------------------------------------------------
    # TABLE 7: Computational Overhead Profiling
    # ----------------------------------------------------
    over_path = "results/final_stage_j/overhead/overhead_analysis_seed1.csv"
    if os.path.exists(over_path):
        df_over = pd.read_csv(over_path)
        table7 = df_over[["method", "avg_total_round_time_s", "total_experiment_time_s", "avg_training_time_s", "avg_shap_time_s", "comm_per_round_kb", "peak_gpu_mem_mb"]].copy()
        table7.columns = ["Method", "Round Latency (s)", "Total Time (s)", "Training Time (s)", "SHAP Time (s)", "Comm/Round (KB)", "Peak GPU Memory (MB)"]
        table7.to_csv(os.path.join(output_dir, "table7_computational_overhead.csv"), index=False)
        logger.info("  [SAVED] Table 7: Computational Overhead")

    # ----------------------------------------------------
    # TABLE 8: Statistical Significance
    # ----------------------------------------------------
    stat_path = "results/final_stage_j/statistics/statistical_significance_tests.csv"
    if os.path.exists(stat_path):
        df_stat = pd.read_csv(stat_path)
        table8 = df_stat[["benchmark", "comparison", "metric", "mean_difference", "p_value_t", "cohens_d", "significant_at_005"]].copy()
        table8.columns = ["Benchmark", "Comparison", "Metric", "Mean Difference", "p-value (t-test)", "Cohen's d", "Significant (p<0.05)"]
        table8.to_csv(os.path.join(output_dir, "table8_statistical_significance.csv"), index=False)
        logger.info("  [SAVED] Table 8: Statistical Significance")


def generate_figures(output_dir="results/final_stage_j/plots"):
    os.makedirs(output_dir, exist_ok=True)
    logger.info("Generating Publication Figures 1 through 10...")

    ms_stats_path = "results/final_stage_j/multiseed/multiseed_statistical_summary.csv"
    df_ms = pd.read_csv(ms_stats_path) if os.path.exists(ms_stats_path) else None

    # ----------------------------------------------------
    # Figure 1: Overall Method Comparison (F1 Score & Malicious Weight under Attack)
    # ----------------------------------------------------
    if df_ms is not None:
        df_p = df_ms[df_ms["benchmark"] == "Model Poisoning"].copy()
        fig, ax1 = plt.subplots(figsize=(11, 5.5))
        x = np.arange(len(df_p))
        width = 0.35

        ax1.bar(x - width/2, df_p["f1_mean"] * 100, width, yerr=df_p["f1_std"] * 100, capsize=4, label="F1 Score (%)", color="#2b5c8f")
        ax1.set_ylabel("F1 Score (%)", color="#2b5c8f", fontweight="bold")
        ax1.set_ylim(0, 105)

        ax2 = ax1.twinx()
        ax2.bar(x + width/2, df_p["mal_weight_mean"], width, yerr=df_p["mal_weight_std"], capsize=4, label="Malicious Weight", color="#c0392b")
        ax2.set_ylabel("Malicious Aggregation Weight", color="#c0392b", fontweight="bold")
        ax2.set_ylim(0, 0.25)

        ax1.set_xticks(x)
        ax1.set_xticklabels(df_p["method"], rotation=25, ha="right")
        plt.title("Figure 1: Defense Performance under Model Poisoning (Mean ± Std, 5 Seeds)", fontweight="bold", pad=15)
        fig.legend(loc="upper right", bbox_to_anchor=(0.90, 0.88))
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig1_overall_method_comparison.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 1: Overall Method Comparison")

    # ----------------------------------------------------
    # Figure 2: Security Robustness across 6 Attack Scenarios
    # ----------------------------------------------------
    sec_path = "results/final_stage_j/security/security_benchmark_seed1.csv"
    if os.path.exists(sec_path):
        df_sec = pd.read_csv(sec_path)
        rep_m = ["FedAvg", "Coordinate Median", "Trimmed Mean", "Multi-Krum", "Proposed (Temporal-Trust)"]
        df_sec_sub = df_sec[df_sec["defense_method"].isin(rep_m)].copy()

        plt.figure(figsize=(12, 5.5))
        sns.barplot(data=df_sec_sub, x="attack_type", y="f1", hue="defense_method", palette="tab10")
        plt.title("Figure 2: Security Robustness Across Attack Vectors (F1 Score)", fontweight="bold", pad=12)
        plt.xlabel("Attack Scenario", fontweight="bold")
        plt.ylabel("IDS F1 Score", fontweight="bold")
        plt.ylim(0, 1.05)
        plt.xticks(rotation=15)
        plt.legend(bbox_to_anchor=(1.02, 1), loc="upper left")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig2_security_robustness.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 2: Security Robustness")

    # ----------------------------------------------------
    # Figure 3: F1 vs Dirichlet Alpha (Non-IID Skew)
    # ----------------------------------------------------
    non_iid_path = "results/final_stage_j/non_iid/non_iid_benchmark_seed1.csv"
    if os.path.exists(non_iid_path):
        df_non_iid = pd.read_csv(non_iid_path)
        plt.figure(figsize=(8.5, 5))
        sns.lineplot(data=df_non_iid, x="alpha", y="f1", hue="method", marker="o", linewidth=2.5, markersize=8, palette="Set1")
        plt.xscale("log")
        plt.title("Figure 3: IDS F1 Score vs Dirichlet Concentration (Non-IID Heterogeneity)", fontweight="bold", pad=12)
        plt.xlabel("Dirichlet Parameter alpha (log scale)", fontweight="bold")
        plt.ylabel("F1 Score", fontweight="bold")
        plt.ylim(0, 1.05)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig3_f1_vs_dirichlet_alpha.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 3: F1 vs Dirichlet Alpha")

    # ----------------------------------------------------
    # Figure 4: Dynamic Trust Separation (Honest vs Malicious)
    # ----------------------------------------------------
    sec_rounds_file = "results/final_stage_j/security/sec_model_poisoning_temporal_trust_seed1_rounds.csv"
    if os.path.exists(sec_rounds_file):
        df_r = pd.read_csv(sec_rounds_file)
        plt.figure(figsize=(7.5, 4.5))
        plt.plot(df_r["round"], df_r["avg_honest_final_trust"], "o-", label="Honest Clients Trust", color="#27ae60", linewidth=2.5)
        plt.plot(df_r["round"], df_r["avg_malicious_final_trust"], "s--", label="Malicious Clients Trust", color="#e74c3c", linewidth=2.5)
        plt.title("Figure 4: Dynamic Trust Separation (Honest vs Malicious)", fontweight="bold", pad=12)
        plt.xlabel("Federated Communication Round", fontweight="bold")
        plt.ylabel("Trust Score (0.0 to 1.0)", fontweight="bold")
        plt.ylim(-0.05, 1.05)
        plt.legend(loc="best")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig4_honest_vs_malicious_trust.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 4: Honest vs Malicious Trust")

    # ----------------------------------------------------
    # Figure 5: Aggregation Weight Allocation across Rounds
    # ----------------------------------------------------
    if os.path.exists(sec_rounds_file):
        plt.figure(figsize=(7.5, 4.5))
        plt.plot(df_r["round"], df_r["honest_weight_sum"], "o-", label="Honest Weight Sum", color="#2980b9", linewidth=2.5)
        plt.plot(df_r["round"], df_r["malicious_weight_sum"], "s--", label="Malicious Weight Sum", color="#d35400", linewidth=2.5)
        plt.title("Figure 5: Aggregation Weight Allocation across Rounds", fontweight="bold", pad=12)
        plt.xlabel("Federated Communication Round", fontweight="bold")
        plt.ylabel("Aggregation Weight Proportion", fontweight="bold")
        plt.ylim(-0.05, 1.05)
        plt.legend(loc="best")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig5_honest_vs_malicious_weight.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 5: Honest vs Malicious Weight")

    # ----------------------------------------------------
    # Figure 6: Progressive Component Ablation (A0 to A5)
    # ----------------------------------------------------
    abl_path = "results/final_stage_j/ablation/ablation_study_seed1.csv"
    if os.path.exists(abl_path):
        df_abl = pd.read_csv(abl_path)
        plt.figure(figsize=(9.5, 4.5))
        sns.barplot(data=df_abl, x="configuration", y="f1", palette="Blues_d")
        plt.title("Figure 6: Progressive Component Ablation (A0 to A5)", fontweight="bold", pad=12)
        plt.xlabel("Ablation Configuration", fontweight="bold")
        plt.ylabel("IDS F1 Score", fontweight="bold")
        plt.ylim(0, 1.05)
        plt.xticks(rotation=20, ha="right")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig6_ablation_comparison.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 6: Component Ablation Comparison")

    # ----------------------------------------------------
    # Figure 7: Privacy-Utility Tradeoff (F1 vs Epsilon)
    # ----------------------------------------------------
    dp_path = "results/final_stage_j/differential_privacy/dp_benchmark_seed1.csv"
    if os.path.exists(dp_path):
        df_dp = pd.read_csv(dp_path)
        df_dp["eps_float"] = pd.to_numeric(df_dp["epsilon_target"], errors="coerce")
        df_dp_finite = df_dp.dropna(subset=["eps_float"]).copy()
        df_dp_finite = df_dp_finite.sort_values("eps_float")

        plt.figure(figsize=(8, 4.5))
        plt.plot(df_dp_finite["eps_float"], df_dp_finite["f1"], "o-", color="#8e44ad", linewidth=2.5, markersize=8)
        plt.title("Figure 7: Privacy-Utility Tradeoff (F1 Score vs DP Budget epsilon)", fontweight="bold", pad=12)
        plt.xlabel("Privacy Budget epsilon (lower = higher privacy)", fontweight="bold")
        plt.ylabel("IDS F1 Score", fontweight="bold")
        plt.ylim(0, 1.05)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig7_privacy_utility_tradeoff.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 7: Privacy-Utility Tradeoff")

    # ----------------------------------------------------
    # Figure 8: Explanation Stability under DP
    # ----------------------------------------------------
    if os.path.exists(dp_path):
        plt.figure(figsize=(8, 4.5))
        plt.plot(df_dp_finite["eps_float"], df_dp_finite["trust_gap"], "s-", color="#16a085", linewidth=2.5, markersize=8)
        plt.title("Figure 8: Explanation Trust Gap Stability Under Differential Privacy", fontweight="bold", pad=12)
        plt.xlabel("Privacy Budget epsilon", fontweight="bold")
        plt.ylabel("Trust Gap (Honest vs Malicious)", fontweight="bold")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig8_explanation_stability_dp.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 8: Explanation Stability under DP")

    # ----------------------------------------------------
    # Figure 9: Computational Overhead Breakdown
    # ----------------------------------------------------
    over_path = "results/final_stage_j/overhead/overhead_analysis_seed1.csv"
    if os.path.exists(over_path):
        df_over = pd.read_csv(over_path)
        plt.figure(figsize=(9.5, 4.5))
        configs = df_over["method"]
        t_tr = df_over["avg_training_time_s"]
        t_sh = df_over["avg_shap_time_s"]
        t_trst = df_over["avg_model_trust_time_s"] + df_over["avg_expl_trust_time_s"] + df_over["avg_temporal_trust_time_s"]

        x = np.arange(len(configs))
        width = 0.5
        plt.bar(x, t_tr, width, label="Local Training", color="#3498db")
        plt.bar(x, t_sh, width, bottom=t_tr, label="SHAP Computation", color="#e67e22")
        plt.bar(x, t_trst, width, bottom=t_tr + t_sh, label="Trust Evaluation", color="#2ecc71")

        plt.xticks(x, configs, rotation=15, ha="right")
        plt.ylabel("Average Round Time (s)", fontweight="bold")
        plt.title("Figure 9: Computational Overhead Breakdown by Component", fontweight="bold", pad=12)
        plt.legend(loc="upper left")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig9_computational_overhead.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 9: Computational Overhead")

    # ----------------------------------------------------
    # Figure 10: Multi-Round Trust Trajectory across Methods
    # ----------------------------------------------------
    pois_fedavg_rounds = "results/final_stage_j/security/sec_model_poisoning_fedavg_seed1_rounds.csv"
    pois_krum_rounds = "results/final_stage_j/security/sec_model_poisoning_krum_seed1_rounds.csv"
    if os.path.exists(sec_rounds_file) and os.path.exists(pois_fedavg_rounds):
        df_prop_r = pd.read_csv(sec_rounds_file)
        df_fed_r = pd.read_csv(pois_fedavg_rounds)

        plt.figure(figsize=(8, 4.5))
        plt.plot(df_prop_r["round"], df_prop_r["trust_gap"], "o-", label="Proposed (Temporal-Trust Gap)", color="#27ae60", linewidth=2.5)
        plt.plot(df_fed_r["round"], df_fed_r["trust_gap"], "s--", label="FedAvg Baseline Gap", color="#e74c3c", linewidth=2.5)
        if os.path.exists(pois_krum_rounds):
            df_krum_r = pd.read_csv(pois_krum_rounds)
            plt.plot(df_krum_r["round"], df_krum_r["trust_gap"], "^-.", label="Krum Baseline Gap", color="#2980b9", linewidth=2.5)

        plt.title("Figure 10: Trust Discrimination Gap Trajectory Across Rounds", fontweight="bold", pad=12)
        plt.xlabel("Federated Round", fontweight="bold")
        plt.ylabel("Trust Gap (Honest Trust - Malicious Trust)", fontweight="bold")
        plt.legend(loc="best")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "fig10_trust_trajectory.png"), dpi=300)
        plt.close()
        logger.info("  [SAVED] Figure 10: Trust Trajectory")


def main():
    logger.info("=" * 95)
    logger.info("   PHASE 12: FINAL PUBLICATION TABLES AND FIGURES GENERATION")
    logger.info("=" * 95)
    generate_tables()
    generate_figures()
    logger.info("Phase 12 artifact generation completed successfully!")


if __name__ == "__main__":
    main()
