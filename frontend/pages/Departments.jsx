import React from 'react';

const departments = [
  {
    name: 'Finance Department',
    manages: [
      'Farm budgeting and cost control',
      'Supplier payments and receivables',
      'Pricing for eggs, birds and chicks',
      'Compliance with tax and audit requirements'
    ],
    icon: '₨'
  },
  {
    name: 'Cleanliness Department',
    manages: [
      'Daily shed and equipment cleaning',
      'Disinfection of vehicles and visitors',
      'Waste management and litter removal',
      'Hygiene training for farm staff'
    ],
    icon: '🧹'
  },
  {
    name: 'Security Department',
    manages: [
      '24/7 farm gate security',
      'Visitor registration and movement logs',
      'Perimeter and shed access control',
      'CCTV monitoring of sensitive areas'
    ],
    icon: '🛡️'
  },
  {
    name: 'Disease Diagnosis Department',
    manages: [
      'Regular flock health checks',
      'Sample collection and on-site lab tests',
      'Vaccination schedules and records',
      'Coordination with external labs and vets'
    ],
    icon: '🧪'
  },
  {
    name: 'Inventory Department',
    manages: [
      'Feed, medicine and equipment stock',
      'Reorder levels and supplier coordination',
      'Batch-wise tracking for inputs',
      'Safe storage of medicines and vaccines'
    ],
    icon: '📦'
  },
  {
    name: 'Safety Equipment Department',
    manages: [
      'Personal protective equipment (PPE)',
      'Fire safety equipment and drills',
      'Training on safe handling of birds',
      'Maintenance of safety signage on farm'
    ],
    icon: '🦺'
  },
  {
    name: 'Transportation Department',
    manages: [
      'Scheduling of egg and bird deliveries',
      'Vehicle maintenance and hygiene',
      'Route planning for time-sensitive orders',
      'Cold chain management for long-distance supply'
    ],
    icon: '🚚'
  }
];

export default function Departments() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            FARM MANAGEMENT STRUCTURE
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Departments that keep Hussain Farms running smoothly.
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Each department has clear responsibilities, enabling predictable
            operations, accurate information and reliable delivery performance.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <article
              key={dept.name}
              className="group flex flex-col rounded-3xl bg-white p-5 text-sm text-slate-700 shadow-soft-card transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-farm-green/10 text-xl">
                  <span>{dept.icon}</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-farm-brown">
                    {dept.name}
                  </h2>
                  <p className="text-[11px] uppercase tracking-wide text-farm-green-dark">
                    Core farm function
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-xs md:text-sm">
                {dept.manages.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-xl bg-farm-beige-dark/70 p-2 group-hover:bg-farm-beige-dark"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-farm-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

