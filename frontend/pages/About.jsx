import React from 'react';

const processSteps = [
  {
    title: 'Hatching',
    description:
      'Fertile eggs go through controlled hatcheries with precise temperature, humidity and rotation for strong chicks.',
    detail:
      'Each batch is monitored with candling tests, hatch rates and daily records.'
  },
  {
    title: 'Feeding',
    description:
      'Nutrition-optimized feed programs designed with poultry nutritionists for each age group.',
    detail:
      'Clean drinking lines, regular feed lab tests and water quality checks are maintained.'
  },
  {
    title: 'Growth',
    description:
      'Ventilation, lighting and space are calibrated to maintain bird comfort and reduce stress.',
    detail:
      'Veterinary team supervises vaccination schedules and flock behaviour daily.'
  },
  {
    title: 'Delivery',
    description:
      'Dedicated dispatch team coordinates chilled vehicles and route planning for on-time delivery.',
    detail:
      'Batch-wise documentation accompanies every shipment for full traceability.'
  }
];

const facilities = [
  'Environment-controlled broiler & layer sheds',
  'Separate desi / free-range rearing area',
  'On-site veterinary room & lab corner',
  'Automated feeding & watering lines',
  'Isolated chick brooding houses',
  'Feed storage silos and secure inventory',
  'Wash bays & disinfection tunnels',
  'Dedicated loading and dispatch bay'
];

const team = [
  {
    role: 'Farm Director',
    name: 'Muhammad Hussain',
    focus: 'Oversees farm strategy, quality commitments and partner relationships.'
  },
  {
    role: 'Veterinary Lead',
    name: 'Dr. Mohsin',
    focus: 'Heads flock health, vaccination programs and laboratory diagnostics.'
  },
  {
    role: 'Operations Manager',
    name: 'Aqeel',
    focus: 'Coordinates sheds, feed supply, inventory and dispatch schedules.'
  },
  {
    role: 'Finance & Compliance',
    name: 'Jamil',
    focus: 'Manages financial planning, audits and regulatory documentation.'
  }
];

export default function About() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Intro */}
        <section className="grid gap-10 md:grid-cols-[1.5fr,1.2fr] md:items-center">
          <div>
            <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
              ABOUT HUSSAIN FARMS
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              A professionally managed poultry farm built on trust and
              traceability.
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-700">
              Hussain Farms operates as a modern poultry enterprise, focused on
              safe, consistent and transparent supply of poultry products. We
              combine biosecurity, scientific nutrition and disciplined
              processes to protect both birds and customers.
            </p>
            <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-soft-card">
                <h3 className="text-sm font-semibold text-farm-brown">
                  Our Mission
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-700">
                  To deliver safe, high-quality poultry products while raising
                  birds responsibly and supporting local communities.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft-card">
                <h3 className="text-sm font-semibold text-farm-brown">
                  Our Vision
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-700">
                  To be the most trusted poultry partner for retailers,
                  restaurants and households across the region.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl shadow-soft-card">
              <img
                src="/images/flock.png"
                alt="Modern poultry farm sheds"
                className="h-64 w-full object-cover md:h-72"
                loading="lazy"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 rounded-2xl bg-farm-green text-white p-4 text-xs md:text-sm">
                <p className="font-semibold">Responsible farming</p>
                <p className="mt-2 text-farm-beige-dark">
                  Biosecurity gates, foot dips, visitor logs and zoning keep
                  flocks protected at every stage.
                </p>
              </div>
              <div className="flex-1 rounded-2xl bg-farm-brown text-farm-beige p-4 text-xs md:text-sm">
                <p className="font-semibold">People-first operations</p>
                <p className="mt-2 text-farm-beige-dark">
                  Trained farm teams, safety equipment and clear processes
                  enable consistent results day after day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="section-padding !pt-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr,1.2fr] md:items-start">
            <div>
              <h2 className="section-title">Farm facilities</h2>
              <p className="section-subtitle">
                The entire campus is designed around flock safety, ease of
                movement and efficient farm routines.
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                {facilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-xl bg-white p-3 shadow-soft-card"
                  >
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-farm-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-farm-beige-dark/70 p-6 shadow-soft-card">
              <h3 className="text-lg font-semibold text-farm-brown">
                Commitment to biosecurity
              </h3>
              <p className="mt-3 text-sm text-slate-700">
                Every entry point, shed and service lane is planned for
                controlled movement. Vehicles pass through wash bays, staff use
                PPE and foot dips, and each flock has defined entry protocols.
              </p>
              <p className="mt-3 text-sm text-slate-700">
                Regular training keeps the entire team aligned on cleanliness
                standards, disease prevention and safe handling of birds and
                eggs.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding !pt-0">
          <h2 className="section-title">Our farm process</h2>
          <p className="section-subtitle">
            From each egg entering the hatchery to final dispatch, the entire
            journey is documented and monitored.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl bg-white p-5 text-sm text-slate-700 shadow-soft-card"
              >
                <div className="absolute -top-3 left-4 inline-flex h-7 items-center rounded-full bg-farm-green text-[11px] font-semibold uppercase tracking-wide text-white px-3">
                  Step {index + 1}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-farm-brown">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs md:text-sm">{step.description}</p>
                <p className="mt-2 text-xs text-slate-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="section-padding !pt-10">
          <h2 className="section-title">Farm leadership team</h2>
          <p className="section-subtitle">
            Experienced professionals lead each function, from flock health to
            finance and logistics.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col rounded-3xl bg-white p-5 text-sm text-slate-700 shadow-soft-card"
              >
                <div className="mb-3 h-16 w-16 rounded-2xl bg-farm-green/10 text-farm-green flex items-center justify-center text-xl font-semibold">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-farm-green-dark">
                  {member.role}
                </p>
                <p className="mt-1 text-sm font-semibold text-farm-brown">
                  {member.name}
                </p>
                <p className="mt-2 text-xs md:text-sm">{member.focus}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

