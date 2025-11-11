import React, { useState } from 'react';
import { AlertCircle, CheckCircle, FileText, Shield, Zap } from 'lucide-react';

const ComplianceMatrix = () => {
  const [selectedSector, setSelectedSector] = useState('fintech');
  const [selectedTier, setSelectedTier] = useState('hustle');

  const sectors = {
    fintech: {
      name: 'FinTech',
      icon: '💰',
      regulators: ['CBK', 'CMA', 'KRA'],
      criticalCompliance: [
        'Central Bank of Kenya licensing',
        'Anti-Money Laundering (AML) compliance',
        'Payment Service Provider registration',
        'Data Protection Act registration',
        'Consumer protection disclosure'
      ],
      ipFocus: ['Software patents', 'API documentation', 'Algorithm protection', 'Brand protection'],
      commonRisks: ['Regulatory sanctions', 'Customer fund security', 'Cross-border payment compliance']
    },
    healthtech: {
      name: 'HealthTech',
      icon: '🏥',
      regulators: ['PPB', 'KMPDC', 'NCK', 'ODPC'],
      criticalCompliance: [
        'Pharmacy and Poisons Board approval',
        'Medical device registration',
        'Patient data protection (HIPAA-equivalent)',
        'Telemedicine practice licenses',
        'Clinical trial approvals if applicable'
      ],
      ipFocus: ['Medical software patents', 'Clinical data ownership', 'Trade secrets', 'Device design protection'],
      commonRisks: ['Patient privacy breaches', 'Unlicensed medical practice', 'Product liability']
    },
    edtech: {
      name: 'EdTech',
      icon: '📚',
      regulators: ['KICD', 'CUE', 'ODPC'],
      criticalCompliance: [
        'Educational content approval (KICD)',
        'Student data protection',
        'Parental consent frameworks',
        'Accessibility compliance',
        'Teacher certification if applicable'
      ],
      ipFocus: ['Course content copyright', 'Platform software', 'Assessment algorithms', 'Brand identity'],
      commonRisks: ['Minor data handling', 'Content licensing disputes', 'Credential verification']
    },
    agritech: {
      name: 'AgriTech',
      icon: '🌾',
      regulators: ['KEPHIS', 'PCPB', 'KALRO'],
      criticalCompliance: [
        'Seed and plant variety certification',
        'Pesticide/fertilizer approvals',
        'Export/import permits',
        'Farmer data protection',
        'Environmental impact assessments'
      ],
      ipFocus: ['Plant variety rights', 'Agricultural processes', 'IoT sensor technology', 'Data analytics'],
      commonRisks: ['Environmental violations', 'Product safety', 'Cross-border trade barriers']
    },
    retail: {
      name: 'Retail & E-commerce',
      icon: '🛒',
      regulators: ['KRA', 'KEBS', 'ODPC', 'CAK'],
      criticalCompliance: [
        'Business permits and trade licenses',
        'Consumer protection compliance',
        'Product safety standards (KEBS)',
        'E-commerce tax compliance',
        'Customer data protection'
      ],
      ipFocus: ['Brand trademarks', 'Platform technology', 'Supply chain software', 'Marketing content'],
      commonRisks: ['Counterfeit products', 'Consumer disputes', 'Tax evasion allegations']
    },
    energy: {
      name: 'Energy & Manufacturing',
      icon: '⚡',
      regulators: ['EPRA', 'NEMA', 'ERC', 'KEBS'],
      criticalCompliance: [
        'Energy Regulatory Commission licenses',
        'Environmental impact assessments',
        'Manufacturing standards certification',
        'Occupational safety compliance',
        'Grid connection approvals'
      ],
      ipFocus: ['Clean tech patents', 'Manufacturing processes', 'Equipment design', 'Energy management software'],
      commonRisks: ['Environmental violations', 'Safety incidents', 'Grid compliance failures']
    }
  };

  const tierServices = {
    hustle: {
      name: 'AIKYA HUSTLE',
      price: 'KSh 25,000/mo',
      focus: 'Foundation & Registration',
      deliverables: [
        'Sector-specific business registration',
        'Basic licensing roadmap',
        'Founders agreement with sector clauses',
        'IP assignment for employees',
        'Data Protection Act registration (ODPC)',
        'Initial regulatory compliance checklist'
      ]
    },
    grow: {
      name: 'AIKYA GROW',
      price: 'KSh 50,000/mo',
      focus: 'Scaling & Compliance',
      deliverables: [
        'Full regulatory license applications',
        'Sector-specific commercial contracts',
        'ESOP with sector considerations',
        'Comprehensive data protection (DPIA)',
        'Industry-specific policies',
        'Quarterly regulatory updates',
        'Investor documentation prep'
      ]
    },
    lead: {
      name: 'AIKYA LEAD',
      price: 'KSh 150,000/mo',
      focus: 'Market Leadership',
      deliverables: [
        'Regulatory representation & advocacy',
        'M&A and complex transactions',
        'Multi-jurisdictional compliance (EMEA)',
        'Board governance & risk management',
        'Dedicated legal team',
        'Strategic regulatory opinions',
        'Cross-border expansion support'
      ]
    }
  };

  const sector = sectors[selectedSector];
  const tier = tierServices[selectedTier];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nafasi x MC Studio Legal Matrix
          </h1>
          <p className="text-lg text-gray-600">
            Sector-Specific Compliance & IP Framework
          </p>
          <div className="mt-4 inline-block bg-purple-100 px-4 py-2 rounded-full">
            <span className="text-purple-800 font-semibold">
              Powered by Okutta & Wairi Advocates
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Sector</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(sectors).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setSelectedSector(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSector === key
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-semibold text-gray-800">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Growth Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(tierServices).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedTier === key
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-lg font-bold text-gray-900 mb-1">{t.name}</div>
                <div className="text-2xl font-bold text-purple-600 mb-2">{t.price}</div>
                <div className="text-sm text-gray-600">{t.focus}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">
                {sector.name} Compliance Requirements
              </h3>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Key Regulators:</h4>
              <div className="flex flex-wrap gap-2">
                {sector.regulators.map((reg, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {reg}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Critical Compliance Items:</h4>
              <ul className="space-y-2">
                {sector.criticalCompliance.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">IP & Risk Profile</h3>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">IP Protection Focus:</h4>
              <ul className="space-y-2">
                {sector.ipFocus.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <FileText className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Common Legal Risks:</h4>
              <ul className="space-y-2">
                {sector.commonRisks.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">{tier.name} - {sector.name} Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">{tier.price}</div>
              <div className="text-purple-100 mb-4">{tier.focus}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Deliverables:</h4>
              <ul className="space-y-2">
                {tier.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>Investment Tracking:</strong> MC Studio tracks startup growth for prospective investors. 
              A 5% finder fee applies to total investment raised, with due diligence fees paid to OW based on startup size.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMatrix;