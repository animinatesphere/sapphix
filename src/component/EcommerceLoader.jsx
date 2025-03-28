import React from "react";

const EcommerceLoader = () => {
  // Inline styles
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    container: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    loader: {
      width: "100px",
      height: "100px",
      position: "relative",
      marginBottom: "20px",
    },
    loaderInner: {
      width: "100%",
      height: "100%",
      position: "absolute",
      animation: "rotate 2.5s linear infinite",
    },
    loaderBlock: (index) => ({
      position: "absolute",
      width: "100%",
      height: "100%",
      border: "4px solid transparent",
      borderTopColor: "#3498db",
      borderRadius: "50%",
      animation: "spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
      animationDelay: `${-1.1 + index * 0.1}s`,
    }),
    loaderText: {
      color: "#333",
      fontSize: "18px",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
    },
    loaderDots: {
      display: "inline-flex",
      marginLeft: "5px",
    },
    loaderDotSpan: (index) => ({
      fontSize: "24px",
      color: "#3498db",
      animation: "dots 1.4s infinite both",
      animationDelay: `${index * 0.2}s`,
    }),
  };

  // Inject keyframe animations
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `
    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }
    @keyframes spin {
      0% { 
        transform: rotate(0deg);
        border-top-color: #3498db;
      }
      50% { 
        border-top-color: #f39c12;
      }
      100% { 
        transform: rotate(360deg);
        border-top-color: #3498db;
      }
    }
    @keyframes dots {
      0%, 20% { opacity: 0; }
      50% { opacity: 1; }
      80%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.loader}>
          <div style={styles.loaderInner}>
            {[...Array(8)].map((_, index) => (
              <div key={index} style={styles.loaderBlock(index)} />
            ))}
          </div>
        </div>
        <div style={styles.loaderText}>
          Loading Sapphix Store
          <span style={styles.loaderDots}>
            {[1, 2, 3].map((dot) => (
              <span key={dot} style={styles.loaderDotSpan(dot)}>
                .
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EcommerceLoader;
