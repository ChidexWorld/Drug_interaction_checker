#!/usr/bin/env node
/**
 * Test script for Drug Interaction Checker API
 * This demonstrates the complete workflow of searching drugs and checking interactions
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

// Test cases for the drug interaction checker
const testCases = [
  {
    name: "Test 1: Major Interaction - Lisinopril + Spironolactone",
    data: {
      drug1: "Lisinopril",
      drug2: "Spironolactone",
      condition_names: ["Hypertension"]
    }
  },
  {
    name: "Test 2: Moderate Interaction - Metformin + Cimetidine", 
    data: {
      drug1: "Metformin",
      drug2: "Cimetidine",
      condition_names: ["Diabetes Mellitus"]
    }
  },
  {
    name: "Test 3: Brand Name Search - Salbutamol + Propanolol",
    data: {
      drug1: "Ventolin", // Brand name for Salbutamol
      drug2: "Inderal",  // Brand name for Propranolol
      condition_names: ["Asthma"]
    }
  },
  {
    name: "Test 4: No Interaction Found",
    data: {
      drug1: "Lisinopril",
      drug2: "Iron Supplement"
    }
  },
  {
    name: "Test 5: Optional condition_names - Without conditions",
    data: {
      drug1: "Lisinopril",
      drug2: "Spironolactone"
    }
  },
  {
    name: "Test 6: Optional condition_names - Empty array",
    data: {
      drug1: "Metformin",
      drug2: "Cimetidine",
      condition_names: []
    }
  }
];

async function testDrugInteractionChecker() {
  console.log('🧪 Testing Drug Interaction Checker API\n');
  console.log('=' .repeat(60));

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${testCase.name}`);
    console.log('-'.repeat(40));
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drug-checker/search-and-check`,
        testCase.data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;
      
      // Display search results
      console.log(`📊 Search Terms: "${testCase.data.drug1}" + "${testCase.data.drug2}"`);
      console.log(`🔍 Found Drugs:`);
      console.log(`   • Drug 1: ${result.drugs.drug1.generic_name} (${result.drugs.drug1.drug_class})`);
      console.log(`     Brands: ${result.drugs.drug1.brands.join(', ')}`);
      console.log(`     Manufacturers: ${result.drugs.drug1.manufacturers.join(', ')}`);
      console.log(`   • Drug 2: ${result.drugs.drug2.generic_name} (${result.drugs.drug2.drug_class})`);
      console.log(`     Brands: ${result.drugs.drug2.brands.join(', ')}`);
      console.log(`     Manufacturers: ${result.drugs.drug2.manufacturers.join(', ')}`);

      // Display interaction results
      if (result.interaction.exists) {
        console.log(`\n⚠️  INTERACTION DETECTED:`);
        console.log(`   Type: ${result.interaction.interaction_type}`);
        console.log(`   Severity: ${result.interaction.severity_score}/4`);
        console.log(`   Risk Level: ${result.interaction.risk_level}`);
        console.log(`   Description: ${result.interaction.description}`);
        
        if (result.interaction.condition_adjusted) {
          console.log(`   🏥 Condition-Adjusted: ${result.interaction.condition_note}`);
        }

        // Display clinical notes
        if (result.clinical_notes.length > 0) {
          console.log(`\n📋 Clinical Notes:`);
          result.clinical_notes.forEach((note, index) => {
            console.log(`   ${index + 1}. ${note.clinical_note}`);
          });
        }

        // Display alternatives for major/contraindicated interactions
        if (result.alternative_drugs.length > 0) {
          console.log(`\n💊 Alternative Drugs:`);
          result.alternative_drugs.forEach((alt, index) => {
            console.log(`   ${index + 1}. ${alt.alternative_name} (${alt.alternative_class})`);
            console.log(`      Reason: ${alt.reason}`);
            console.log(`      Safety Note: ${alt.safety_note}`);
          });
        }

        // Display recommendations
        if (result.recommendations.length > 0) {
          console.log(`\n📌 Recommendations:`);
          result.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
          });
        }
      } else {
        console.log(`\n✅ NO INTERACTIONS DETECTED`);
        console.log(`   Risk Level: ${result.interaction.risk_level}`);
        console.log(`   Message: ${result.interaction.message}`);
        
        if (result.recommendations.length > 0) {
          console.log(`\n📌 Recommendations:`);
          result.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
          });
        }
      }

    } catch (error) {
      console.log(`❌ ERROR: ${error.response?.data?.message || error.message}`);
      if (error.response?.data?.error) {
        console.log(`   Details: ${error.response.data.error}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

// Additional test for individual drug search
async function testDrugSearch() {
  console.log('\n🔍 Testing Individual Drug Search\n');
  
  const searchTerms = ["Lisinopril", "Ventolin", "Metformin"];
  
  for (const term of searchTerms) {
    try {
      const response = await axios.get(`${API_BASE_URL}/drugs/search?query=${term}`);
      const results = response.data;
      
      console.log(`Search for "${term}": Found ${results.count} results`);
      results.results.forEach((drug, index) => {
        console.log(`  ${index + 1}. ${drug.generic_name} (${drug.drug_class})`);
        if (drug.brands.length > 0) {
          console.log(`     Brands: ${drug.brands.join(', ')}`);
        }
      });
      console.log('');
    } catch (error) {
      console.log(`❌ Search error for "${term}": ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  try {
    // First check if server is running
    await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Server is running\n');
    
    // Run tests
    await testDrugSearch();
    await testDrugInteractionChecker();
    
    console.log('\n🎉 All tests completed!');
    console.log('\nAPI Usage:');
    console.log(`POST ${API_BASE_URL}/drug-checker/search-and-check`);
    console.log('Body: { "drug1": "Drug Name", "drug2": "Drug Name", "condition_names": ["Hypertension", "Diabetes Mellitus"] }');
    
  } catch (error) {
    console.log(`❌ Server is not running or accessible at ${API_BASE_URL}`);
    console.log('Please start the server first with: npm start or npm run dev');
    console.log('Error:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testDrugInteractionChecker, testDrugSearch };