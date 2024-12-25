function fetchDriversAndRenderChart() {
  $.ajax({
      url: 'api/driver_api/drivers',  // Ensure this URL is correct
      type: 'GET',
      dataType: 'json',
      success: function(data) {
          var ages = data.map(driver => driver.age);
          var ageCount = ageCounts(ages);
          var genders = data.map(driver => driver.gender);  // Assuming your API returns a list of objects with a 'gender' field
          var genderCount = genderCounts(genders);
          var maritalStatusCounts = maritalStatusByGender(data);
          createBarChart(ageCount, 'Age', 'Distribution of Driver Ages');
          createGenderPieChart(genderCount, 'Gender Distribution of Drivers');
          createRadarChart(maritalStatusCounts, 'Marital Status Distribution by Gender');
      },
      error: function(jqXHR, textStatus, errorThrown) {
          alert('Failed to fetch drivers: ' + textStatus);
      }
  });
}

function ageCounts(ages) {
  let ageCounts = {};

  ages.forEach(age => {
      if (ageCounts[age]) {
          ageCounts[age] += 1;  // Increment the count if the age is already in the dictionary
      } else {
          ageCounts[age] = 1;  // Initialize with 1 if the age is not yet in the dictionary
      }
  });

  return ageCounts;
}


function createBarChart(ageCounts, label, chartTitle)
{
  var ctx = document.getElementById('driverAgeBarChart').getContext('2d');

  var ages = Object.keys(ageCounts);
  var counts = Object.values(ageCounts);

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ages,
      datasets: [{
        label: label,
        data: counts,
        backgroundColor: 'rgba(128, 0, 128, 0.2)', // Light purple with opacity
        borderColor: 'rgb(128, 0, 128)',   
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y:  {
          beginAtZero: true
        }
      },
      plugins: {
          title: {
            display: true,
            text: chartTitle
          },
      }
    }
    
  });
}


function genderCounts(genders) {
  let genderCounts = {};

  genders.forEach(gender => {
    if (genderCounts[gender]) {
      genderCounts[gender] += 1;  // Increment the count if the gender is already in the dictionary
    } else {
      genderCounts[gender] = 1;  // Initialize with 1 if the gender is not yet in the dictionary
    }
  });

  return genderCounts;
}

function genderCounts(genders) {
    let genderCounts = {};
  
    genders.forEach(gender => {
      if (genderCounts[gender]) {
        genderCounts[gender] += 1;  // Increment the count if the gender is already in the dictionary
      } else {
        genderCounts[gender] = 1;  // Initialize with 1 if the gender is not yet in the dictionary
      }
    });
  
    return genderCounts;
  }
  
  function createGenderPieChart(genderCounts, chartTitle) {
    var ctx = document.getElementById('driverGenderPieChart').getContext('2d');
  
    var labels = Object.keys(genderCounts);
    var counts = Object.values(genderCounts);

    document.getElementById('maleCount').textContent = `Males: ${genderCounts.M || 0}`;
    document.getElementById('femaleCount').textContent = `Females: ${genderCounts.F || 0}`;
  
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gender Distribution',
                data: counts,
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
                borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: chartTitle
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.chart.data.labels[context.dataIndex];
                            let count = context.raw;
                            return `${label}: ${count}`;
                        }
                    }
                }
            }
        }
    });
  }

function maritalStatusByGender(drivers) {
  let counts = {
      maleYes: 0,
      maleNo: 0,
      femaleYes: 0,
      femaleNo: 0
  };

  drivers.forEach(driver => {
      if (driver.gender === 'M') {
          if (driver.mstatus === 'Yes') {
              counts.maleYes++;
          } else if (driver.mstatus === 'No') {
              counts.maleNo++;
          }
      } else if (driver.gender === 'F') {
          if (driver.mstatus === 'Yes') {
              counts.femaleYes++;
          } else if (driver.mstatus === 'No') {
              counts.femaleNo++;
          }
      }
  });

  return counts;
}

function createRadarChart(data, chartTitle) {
  var ctx = document.getElementById('maritalStatusRadarChart').getContext('2d');
  window.myChartchart = new Chart(ctx, {
      type: 'radar',
      data: {
          labels: ['Male - Yes', 'Male - No', 'Female - Yes', 'Female - No'],
          datasets: [{
              label: 'Marital Status',
              data: [data.maleYes, data.maleNo, data.femaleYes, data.femaleNo],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              r: {
                  angleLines: {
                      display: true
                  },
                  suggestedMin: 0
              }
          },
          plugins: {
              legend: {
                  position: 'top',
              },
              title: {
                  display: true,
                  text: chartTitle
              }
          }
      }
  });
}

function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}


function fetchDataAndRenderScatterChart() {
  // Fetching drivers data
  $.ajax({
      url: 'api/driver_api/drivers',
      type: 'GET',
      dataType: 'json',
      success: function(driversData) {
          // Fetching claims data
          $.ajax({
              url: 'api/claim_api/claims',  // Replace with your actual URL for claims data
              type: 'GET',
              dataType: 'json',
              success: function(fullclaimsData) {
                  var claimsData = getRandomSubarray(fullclaimsData, 50);  // Get random 50 claims
                  var mergedData = mergeData(driversData, claimsData);
                  createScatterChart(mergedData, 'Age vs. Claims', 'Number of Claims by Age');

              },
              error: function(jqXHR, textStatus, errorThrown) {
                  alert('Failed to fetch claims: ' + textStatus);
              }
          });
      },
      error: function(jqXHR, textStatus, errorThrown) {
          alert('Failed to fetch drivers: ' + textStatus);
      }
  });
}

function mergeData(drivers, claims) {
  var driverMap = {};
  // Create a map of driver_id to age
  drivers.forEach(driver => {
      driverMap[driver.driver_id] = driver.age;
  });

  var mergedData = [];
  // Combine with claims data
  claims.forEach(claim => {
      if (driverMap[claim.driver_id]) {
          mergedData.push({
              x: driverMap[claim.driver_id],  // Age of the driver
              y: claim.id  // Assuming claims data has a num_claims field
          });
      }
  });

  return mergedData;
}

function createScatterChart(data, label, chartTitle) {
  var ctx = document.getElementById('driverClaimsScatterChart').getContext('2d');

  window.myScatterChart = new Chart(ctx, {
      type: 'scatter',
      data: {
          datasets: [{
              label: label,
              data: data,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              x: {
                  type: 'linear',
                  position: 'bottom',
                  title: {
                      display: true,
                      text: 'Age'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Claim ID '
                  }
              }
          },
          plugins: {
              title: {
                  display: true,
                  text: chartTitle
              },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Age: ${context.raw.x}, Claim ID: ${context.raw.y}`;
                        }
                    }
                }
          }
      }
  });
  document.getElementById('addLineOfBestFit').addEventListener('click', function() {
    addLineOfBestFit(myScatterChart, data);
    this.disabled = true; 
});
}

function addLineOfBestFit(chart, data) {
  // Calculate the line of best fit
  var xSum = 0, ySum = 0, xySum = 0, xxSum = 0, count = data.length;

  data.forEach(function(datum) {
      xSum += datum.x;
      ySum += datum.y;
      xySum += datum.x * datum.y;
      xxSum += datum.x * datum.x;
  });

  var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
  var intercept = (ySum - slope * xSum) / count;

  // Define the end points of the line
  var xMin = Math.min(...data.map(d => d.x));
  var xMax = Math.max(...data.map(d => d.x));

  var bestFitLine = {
      type: 'line',
      label: 'Line of Best Fit',
      data: [{
          x: xMin,
          y: xMin * slope + intercept
      }, {
          x: xMax,
          y: xMax * slope + intercept
      }],
      borderColor: 'red',
      borderWidth: 2
  };

  // Add the line to the existing chart
  chart.data.datasets.push(bestFitLine);
  chart.update();
}

function fetchCarTypesAndRenderPolarChart() {
    $.ajax({
        url: 'api/car_api/cars', // Ensure this URL is correct
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var carTypeCounts = countCarTypes(data);
            createPolarAreaChart(carTypeCounts, 'Distribution of Car Types');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Failed to fetch car data: ' + textStatus);
        }
    });
}

function countCarTypes(cars) {
    let carTypeCounts = {};
    cars.forEach(car => {
        if (carTypeCounts[car.car_type]) {
            carTypeCounts[car.car_type] += 1;
        } else {
            carTypeCounts[car.car_type] = 1;
        }
    });
    return carTypeCounts;
}

function createPolarAreaChart(data, chartTitle) {
    var ctx = document.getElementById('carTypePolarChart').getContext('2d');
    var labels = Object.keys(data);
    var counts = Object.values(data);

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Car Types',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: chartTitle
                }
            }
        }
    });
}

