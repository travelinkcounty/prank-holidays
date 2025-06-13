import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d8f] to-[#e30613] opacity-90" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[#ffc72c]">Refund Policy</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Learn about how we handle refunds, cool off periods, and holiday cancellations for our members.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto py-12 px-4 md:px-0 text-[#23272b]">
        <h1 className="text-4xl font-extrabold text-[#e63946] mb-6">Refund Policy</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-[#1a4d8f]">Cool Off Period</h2>
          <p className="mb-2">
            There shall be a <b>cool off period of 10 days</b> from the date of signing of this Agreement wherein a member can discontinue the agreement by paying a nominal administration charge of <b>Rs. 15,000/-</b> to the Company. After deduction of the aforesaid amount (Rs. 15,000/-), the remaining amount would be refunded to the member <b>within 120 days</b> from the date of invoking the cool off period.
          </p>
          <p className="mb-2">
            For invoking the cooling off period, the member shall send a written communication to <b>TRAVELINK COUNTY PRIVATE LTD.</b> Club, Center customer care, 811, Meghdoot Building, Nehru Place, New Delhi 110019, through registered speed post or an e-mail to <a href="mailto:travelinkcounty@gmail.com" className="text-[#e63946] underline">travelinkcounty@gmail.com</a>.
          </p>
          <p className="mb-2">
            <b>After expiry of the aforesaid period, the entire membership fee is non-refundable under any circumstances.</b>
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-[#1a4d8f]">Holiday Exchange & Cancellation</h2>
          <ul className="list-disc pl-6 mb-2">
            <li>
              There are options for exchanging booked holidays.
            </li>
            <li>
              A <b>100% debit of booked holidays</b> occurs if cancellation is within 30 days of the check-in date.
            </li>
            <li>
              If a cancellation request is 30 days or more from the check-in date, there's no debit, but the exchange fee is non-refundable.
            </li>
            <li>
              In cases where <b>TRAVELINK COUNTY</b> cancels the event, a <b>100% refund of payment</b> is provided within 45 days.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2 text-[#1a4d8f]">Contact for Refunds</h2>
          <p>
            For any refund-related queries, please contact us at <a href="mailto:travelinkcounty@gmail.com" className="text-[#e63946] underline">travelinkcounty@gmail.com</a> or visit our customer care at 811, Meghdoot Building, Nehru Place, New Delhi 110019.
          </p>
        </section>
      </div>
    </div>
  );
}
