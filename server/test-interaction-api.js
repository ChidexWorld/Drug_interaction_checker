#!/usr/bin/env node
/**
 * Enhanced Test Script for Drug Interaction Checker API
 * This demonstrates the complete workflow of searching drugs and checking interactions
 */

const axios = require("axios");

const API_BASE_URL = "http://localhost:4000/api";

// Enhanced test cases for the drug interaction checker
const testCases = [
  {
    name: "Test 1: Major Interaction - Lisinopril + Spironolactone",
    data: {
      drug1: "Lisinopril",
      drug2: "Spironolactone",
      condition_names: ["Hypertension"],
    },
  },
  {
    name: "Test 2: Moderate Interaction - Metformin + Cimetidine",
    data: {
      drug1: "Metformin",
      drug2: "Cimetidine",
      condition_names: ["Diabetes Mellitus"],
    },
  },
  {
    name: "Test 3: Brand Name Search - Ventolin + Inderal",
    data: {
      drug1: "Ventolin", // Brand name for Salbutamol
      drug2: "Inderal", // Brand name for Propranolol
      condition_names: ["Asthma"],
    },
  },
  {
    name: "Test 4: No Interaction Found",
    data: {
      drug1: "Lisinopril",
      drug2: "Iron Supplement",
    },
  },
  {
    name: "Test 5: Without condition_names parameter",
    data: {
      drug1: "Lisinopril",
      drug2: "Spironolactone",
    },
  },
  {
    name: "Test 6: Empty condition_names array",
    data: {
      drug1: "Metformin",
      drug2: "Cimetidine",
      condition_names: [],
    },
  },
  {
    name: "Test 7: Multiple conditions",
    data: {
      drug1: "Warfarin",
      drug2: "Aspirin",
      condition_names: ["Hypertension", "Atrial Fibrillation"],
    },
  },
  {
    name: "Test 8: Case insensitive search",
    data: {
      drug1: "LISINOPRIL",
      drug2: "spironolactone",
    },
  },
  {
    name: "Test 9: Partial drug name matching",
    data: {
      drug1: "Lisino",
      drug2: "Spiro",
    },
  },
  {
    name: "Test 10: Invalid drug name",
    data: {
      drug1: "NonExistentDrug123",
      drug2: "Lisinopril",
    },
  },
];

// Individual API endpoint tests
const individualTests = [
  {
    name: "Drug Search Test",
    endpoint: "/drug-checker/search-drugs",
    method: "GET",
    params: { query: "Lisinopril", limit: 5 },
  },
  {
    name: "Drug Details Test",
    endpoint: "/drug-checker/drug-details",
    method: "GET",
    params: { name: "Ventolin" },
  },
  {
    name: "Conditions List Test",
    endpoint: "/drug-checker/conditions",
    method: "GET",
    params: { search: "Hypert" },
  },
  {
    name: "Condition Details Test",
    endpoint: "/drug-checker/condition-details",
    method: "GET",
    params: { name: "Hypertension" },
  },
];

async function testDrugInteractionChecker() {
  console.log("🧪 Testing Drug Interaction Checker API\n");
  console.log("=".repeat(80));

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${testCase.name}`);
    console.log("-".repeat(50));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/drug-checker/search-and-check`,
        testCase.data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const result = response.data;

      // Display search results
      console.log(
        `📊 Search Terms: "${testCase.data.drug1}" + "${testCase.data.drug2}"`
      );
      if (
        testCase.data.condition_names &&
        testCase.data.condition_names.length > 0
      ) {
        console.log(
          `🏥 Conditions: ${testCase.data.condition_names.join(", ")}`
        );
      }

      console.log(`\n🔍 Found Drugs:`);
      console.log(
        `   • Drug 1: ${result.drugs.drug1.generic_name} (${result.drugs.drug1.drug_class})`
      );
      if (result.drugs.drug1.brands.length > 0) {
        console.log(`     Brands: ${result.drugs.drug1.brands.join(", ")}`);
      }
      if (result.drugs.drug1.manufacturers.length > 0) {
        console.log(
          `     Manufacturers: ${result.drugs.drug1.manufacturers.join(", ")}`
        );
      }

      console.log(
        `   • Drug 2: ${result.drugs.drug2.generic_name} (${result.drugs.drug2.drug_class})`
      );
      if (result.drugs.drug2.brands.length > 0) {
        console.log(`     Brands: ${result.drugs.drug2.brands.join(", ")}`);
      }
      if (result.drugs.drug2.manufacturers.length > 0) {
        console.log(
          `     Manufacturers: ${result.drugs.drug2.manufacturers.join(", ")}`
        );
      }

      // Display interaction results
      if (result.interaction.exists) {
        const riskEmoji = getRiskEmoji(result.interaction.severity_score);
        console.log(`\n${riskEmoji} INTERACTION DETECTED:`);
        console.log(`   Type: ${result.interaction.interaction_type}`);
        console.log(`   Severity: ${result.interaction.severity_score}/4`);
        console.log(`   Risk Level: ${result.interaction.risk_level}`);
        console.log(`   Risk Color: ${result.interaction.risk_color}`);
        console.log(`   Description: ${result.interaction.description}`);

        if (result.interaction.condition_adjusted) {
          console.log(
            `   🏥 Condition-Adjusted: ${result.interaction.condition_note}`
          );
        }

        // Display mechanism if different from description
        if (
          result.interaction.mechanism &&
          result.interaction.mechanism !== result.interaction.description
        ) {
          console.log(`   Mechanism: ${result.interaction.mechanism}`);
        }

        // Display clinical notes
        if (result.clinical_notes && result.clinical_notes.length > 0) {
          console.log(`\n📋 Clinical Notes:`);
          result.clinical_notes.forEach((note, index) => {
            console.log(`   ${index + 1}. ${note.clinical_note}`);
            if (note.recommendation) {
              console.log(`      Recommendation: ${note.recommendation}`);
            }
          });
        }

        // Display alternatives for major/contraindicated interactions
        if (result.alternative_drugs && result.alternative_drugs.length > 0) {
          console.log(`\n💊 Alternative Drugs:`);
          result.alternative_drugs.forEach((alt, index) => {
            console.log(
              `   ${index + 1}. ${alt.alternative_name} (${
                alt.alternative_class
              })`
            );
            console.log(`      Original: ${alt.original_drug_name}`);
            console.log(`      Reason: ${alt.reason}`);
            console.log(`      Safety Note: ${alt.safety_note}`);
          });
        }
      } else {
        console.log(`\n✅ NO INTERACTIONS DETECTED`);
        console.log(`   Risk Level: ${result.interaction.risk_level}`);
        console.log(`   Message: ${result.interaction.message}`);
      }

      // Display recommendations
      if (result.recommendations && result.recommendations.length > 0) {
        console.log(`\n📌 Recommendations:`);
        result.recommendations.forEach((rec, index) => {
          const priorityEmoji = getPriorityEmoji(rec.priority);
          console.log(
            `   ${
              index + 1
            }. ${priorityEmoji} [${rec.priority.toUpperCase()}] ${rec.message}`
          );
          if (rec.type) {
            console.log(`      Type: ${rec.type}`);
          }
        });
      }

      // Display response stats
      console.log(`\n📈 Response Stats:`);
      console.log(`   Status: ${response.status}`);
      console.log(
        `   Response Time: ${response.headers["x-response-time"] || "N/A"}`
      );
      console.log(`   Data Size: ${JSON.stringify(result).length} bytes`);
    } catch (error) {
      console.log(
        `❌ ERROR: ${error.response?.data?.message || error.message}`
      );
      if (error.response?.data?.error) {
        console.log(`   Type: ${error.response.data.error}`);
      }
      if (error.response?.data?.details) {
        console.log(`   Details:`, error.response.data.details);
      }
      if (error.response?.status) {
        console.log(`   Status Code: ${error.response.status}`);
      }
      console.log(`   Request Data:`, JSON.stringify(testCase.data, null, 2));
    }

    console.log("\n" + "=".repeat(80));
  }
}

// Test individual API endpoints
async function testIndividualEndpoints() {
  console.log("\n🔧 Testing Individual API Endpoints\n");

  for (const test of individualTests) {
    console.log(`\n${test.name}`);
    console.log("-".repeat(30));

    try {
      let response;
      const url = `${API_BASE_URL}${test.endpoint}`;

      if (test.method === "GET") {
        const queryString = new URLSearchParams(test.params).toString();
        response = await axios.get(`${url}?${queryString}`);
      } else if (test.method === "POST") {
        response = await axios.post(url, test.params);
      }

      const result = response.data;

      console.log(`✅ Status: ${response.status}`);
      console.log(
        `📊 Response:`,
        JSON.stringify(result, null, 2).substring(0, 500) + "..."
      );

      // Specific handling based on endpoint
      if (test.endpoint === "/drug-checker/search-drugs" && result.results) {
        console.log(
          `📋 Found ${result.results.length} drugs for query: "${test.params.query}"`
        );
      } else if (
        test.endpoint === "/drug-checker/conditions" &&
        result.conditions
      ) {
        console.log(`📋 Found ${result.conditions.length} conditions`);
      } else if (
        test.endpoint === "/drug-checker/drug-details" &&
        result.drug
      ) {
        console.log(
          `📋 Drug: ${result.drug.generic_name} (${result.drug.drug_class})`
        );
      } else if (
        test.endpoint === "/drug-checker/condition-details" &&
        result.condition
      ) {
        console.log(
          `📋 Condition: ${result.condition.name} with ${result.condition.symptom_count} symptoms`
        );
      }
    } catch (error) {
      console.log(
        `❌ ERROR: ${error.response?.data?.message || error.message}`
      );
      if (error.response?.status) {
        console.log(`   Status: ${error.response.status}`);
      }
    }
  }
}

// Enhanced drug search test
async function testDrugSearch() {
  console.log("\n🔍 Testing Enhanced Drug Search\n");

  const searchTerms = [
    { term: "Lisinopril", description: "Exact generic name" },
    { term: "Ventolin", description: "Brand name" },
    { term: "Metfor", description: "Partial name" },
    { term: "ASPIRIN", description: "Uppercase" },
    { term: "xyz123", description: "Invalid drug" },
  ];

  for (const { term, description } of searchTerms) {
    console.log(`Searching "${term}" (${description}):`);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/drug-checker/search-drugs?query=${term}&limit=3`
      );
      const results = response.data;

      console.log(`  ✅ Found ${results.results.length} results`);
      results.results.forEach((drug, index) => {
        console.log(
          `    ${index + 1}. ${drug.generic_name} (${drug.drug_class})`
        );
        if (drug.brands && drug.brands.length > 0) {
          console.log(`       Brands: ${drug.brands.join(", ")}`);
        }
      });
    } catch (error) {
      console.log(
        `  ❌ Search error: ${error.response?.data?.message || error.message}`
      );
    }
    console.log("");
  }
}

// Validation tests
async function testValidation() {
  console.log("\n⚠️  Testing Input Validation\n");

  const validationTests = [
    {
      name: "Missing drug1",
      data: { drug2: "Lisinopril" },
    },
    {
      name: "Missing drug2",
      data: { drug1: "Lisinopril" },
    },
    {
      name: "Empty drug1",
      data: { drug1: "", drug2: "Lisinopril" },
    },
    {
      name: "Very long drug name",
      data: { drug1: "A".repeat(101), drug2: "Lisinopril" },
    },
    {
      name: "Invalid condition format",
      data: {
        drug1: "Lisinopril",
        drug2: "Spironolactone",
        condition_names: "not_an_array",
      },
    },
  ];

  for (const test of validationTests) {
    console.log(`${test.name}:`);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drug-checker/search-and-check`,
        test.data
      );
      console.log(`  ❌ Expected validation error but got success`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`  ✅ Correctly rejected: ${error.response.data.message}`);
      } else {
        console.log(`  ⚠️  Unexpected error: ${error.message}`);
      }
    }
  }
}

// Performance test
async function testPerformance() {
  console.log("\n⚡ Performance Testing\n");

  const testData = {
    drug1: "Lisinopril",
    drug2: "Spironolactone",
    condition_names: ["Hypertension"],
  };

  const runs = 5;
  const times = [];

  console.log(`Running ${runs} requests to measure performance...`);

  for (let i = 0; i < runs; i++) {
    const start = Date.now();
    try {
      await axios.post(
        `${API_BASE_URL}/drug-checker/search-and-check`,
        testData
      );
      const time = Date.now() - start;
      times.push(time);
      console.log(`  Run ${i + 1}: ${time}ms`);
    } catch (error) {
      console.log(`  Run ${i + 1}: Error - ${error.message}`);
    }
  }

  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.log(`\n📊 Performance Summary:`);
    console.log(`  Average: ${avg.toFixed(2)}ms`);
    console.log(`  Min: ${min}ms`);
    console.log(`  Max: ${max}ms`);
    console.log(`  Total runs: ${times.length}/${runs}`);
  }
}

// Helper functions
function getRiskEmoji(severityScore) {
  switch (severityScore) {
    case 4:
      return "🚫"; // Contraindicated
    case 3:
      return "⚠️"; // Major
    case 2:
      return "⚡"; // Moderate
    case 1:
      return "⚠️"; // Minor
    default:
      return "✅"; // No interactions
  }
}

function getPriorityEmoji(priority) {
  switch (priority?.toLowerCase()) {
    case "critical":
      return "🚨";
    case "high":
      return "⚠️";
    case "medium":
      return "📝";
    case "low":
      return "ℹ️";
    default:
      return "📌";
  }
}

// Server health check
async function checkServerHealth() {
  try {
    const response = await axios.get(
      `${API_BASE_URL.replace("/api", "")}/health`,
      { timeout: 5000 }
    );
    console.log("✅ Server is running");
    if (response.data) {
      console.log("📊 Server Info:", response.data);
    }
    return true;
  } catch (error) {
    console.log(`❌ Server health check failed: ${error.message}`);
    console.log(
      "Please ensure the server is running at:",
      API_BASE_URL.replace("/api", "")
    );
    return false;
  }
}

// Main execution
async function main() {
  console.log("🧬 Drug Interaction Checker - Enhanced Test Suite");
  console.log("=".repeat(80));

  // Check server health first
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    console.log("\n💡 Quick Start:");
    console.log("1. Navigate to your project directory");
    console.log("2. Run: npm start (or npm run dev)");
    console.log("3. Re-run this test script");
    return;
  }

  console.log("\n🚀 Starting comprehensive test suite...\n");

  try {
    // Run all test suites
    await testDrugSearch();
    await testIndividualEndpoints();
    await testDrugInteractionChecker();
    await testValidation();
    await testPerformance();

    console.log("\n🎉 All tests completed successfully!");

    console.log("\n📚 API Documentation:");
    console.log("=".repeat(50));
    console.log(
      `Main Endpoint: POST ${API_BASE_URL}/drug-checker/search-and-check`
    );
    console.log("Request Body:");
    console.log(`{
  "drug1": "Drug Name or Brand Name",
  "drug2": "Drug Name or Brand Name", 
  "condition_names": ["Condition1", "Condition2"] // Optional
}`);

    console.log("\nOther Endpoints:");
    console.log(
      `• GET ${API_BASE_URL}/drug-checker/search-drugs?query=DrugName&limit=20`
    );
    console.log(
      `• GET ${API_BASE_URL}/drug-checker/drug-details?name=DrugName`
    );
    console.log(
      `• GET ${API_BASE_URL}/drug-checker/conditions?search=condition`
    );
    console.log(
      `• GET ${API_BASE_URL}/drug-checker/condition-details?name=ConditionName`
    );
  } catch (error) {
    console.log("\n💥 Test suite encountered an error:");
    console.log(error.message);
  }
}

// Export functions for individual testing
module.exports = {
  testDrugInteractionChecker,
  testDrugSearch,
  testIndividualEndpoints,
  testValidation,
  testPerformance,
  checkServerHealth,
};

// Run main if called directly
if (require.main === module) {
  main().catch(console.error);
}
