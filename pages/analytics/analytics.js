let categoryChartRef = null;
let publicPrivateChartRef = null;

function loadAnalytics() {
  const prompts = getPrompts();

  document.getElementById("statTotal").innerText = prompts.length;
  document.getElementById("statPublic").innerText = prompts.filter(p => p.public).length;
  document.getElementById("statFav").innerText = prompts.filter(p => p.favorite).length;

  if (typeof Chart === 'undefined') return;

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const textColor = isLight ? '#0f172a' : '#f8fafc';
  const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)';

  Chart.defaults.color = textColor;

  // Cleanup existing charts if they exist
  if (categoryChartRef) categoryChartRef.destroy();
  if (publicPrivateChartRef) publicPrivateChartRef.destroy();

  // Public vs Private Pie Chart
  publicPrivateChartRef = new Chart(document.getElementById('publicPrivateChart'), {
    type: 'pie',
    data: {
      labels: ['Public', 'Private'],
      datasets: [{
        data: [prompts.filter(p => p.public).length, prompts.length - prompts.filter(p => p.public).length],
        backgroundColor: ['#10b981', '#3b82f6'], 
        borderWidth: 0
      }]
    },
    options: { 
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // Category Bar Chart
  const categories = {};
  prompts.forEach(p => { 
    const cat = p.category || "Other";
    categories[cat] = (categories[cat] || 0) + 1; 
  });

  categoryChartRef = new Chart(document.getElementById('categoryChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(categories),
      datasets: [{ 
        label: 'Prompts', 
        data: Object.values(categories), 
        backgroundColor: '#3b82f6', 
        borderRadius: 8 
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor } },
        x: { grid: { color: gridColor } }
      },
      plugins: { 
        legend: { display: false } 
      }
    }
  });
}

// Re-load charts on theme change
window.addEventListener('themeChanged', () => {
    loadAnalytics();
});

document.addEventListener('DOMContentLoaded', loadAnalytics);
