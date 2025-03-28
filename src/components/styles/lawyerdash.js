const styles = {
  caseContainer: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    maxWidth: '600px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '20px'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  infoRow: {
    marginBottom: '15px'
  },
  label: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '5px'
  },
  value: {
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold'
  },

    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      borderRadius: '8px'
    },
    navbarBrand: {
      color: '#e88d7d',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0
    },
    logoutButton: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'background-color 0.3s'
    },
    
    // Dashboard styles
    dashboardContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f2f0',
      minHeight: '100vh'
    },
    contentContainer: {
      padding: '20px',
    },
    heading: {
      color: '#e88d7d',
      marginBottom: '30px',
      borderBottom: '2px solid #e88d7d',
      paddingBottom: '10px'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      padding: '25px',
      marginBottom: '30px'
    },
    sectionHeading: {
      color: '#e88d7d',
      marginTop: '0',
      marginBottom: '20px',
      fontSize: '1.4rem'
    },
    searchBox: {
      display: 'flex',
      marginBottom: '20px'
    },
    input: {
      flex: '1',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px 0 0 5px',
      fontSize: '16px'
    },
    button: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '12px 15px',
      borderRadius: '0 5px 5px 0',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    tableHeader: {
      backgroundColor: '#f5f2f0',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      color: '#333'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#333',
      fontSize: '0.875rem'
    },
    textInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      minHeight: '100px',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    },
    partyInput: {
      display: 'flex',
      marginBottom: '10px'
    },
    partyList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '10px'
    },
    partyTag: {
      backgroundColor: '#f9e4e0',
      color: '#e88d7d',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '14px'
    },
    error: {
      color: '#c62828',
      marginTop: '10px',
      background: '#ffebee',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '0.875rem'
    },
    submitBtn: {
      backgroundColor: '#e88d7d',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      marginTop: '10px',
      width: '100%'
    }
  };

  export default styles;