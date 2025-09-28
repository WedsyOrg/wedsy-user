import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 md:py-16 md:px-24">
      <h2 className="text-rose-900 font-semibold text-2xl">
        TERMS & CONDITIONS
      </h2>
      <p className="pt-8">
        Welcome to WEDSY! These Terms and Conditions govern your use of our
        website. By accessing and using WEDSY, you agree to be bound by these
        terms.
      </p>
      <div className="pt-6 flex flex-col gap-3 text-justify">
        <div>
          <p className="text-xl font-semibold">1. Acceptance of Terms</p>
          <p>
            By using WEDSY, you agree to comply with and be bound by these Terms
            and Conditions. If you do not agree, please do not use our website.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">2. Use of the Website</p>
          <p>
            You may use WEDSY for personal and non-commercial purposes. You
            agree not to use the website for any illegal or unauthorized
            purpose.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">3. Product Information</p>
          <p>
            We strive to provide accurate and up-to-date product information.
            However, we do not guarantee the accuracy, completeness, or
            reliability of any product information on our website.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">4. Pricing and Payment</p>
          <p>
            All prices are in [currency] and are subject to change without
            notice. We reserve the right to refuse or cancel any order at our
            sole discretion. Payment is required upon order placement.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">5. Shipping and Delivery</p>
          <p>
            Shipping and delivery times are estimates and may vary. We are not
            responsible for any delays or issues caused by third-party carriers.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">6. Returns and Refunds</p>
          <p className="text-lg">Refund Policy - Decor Services</p>
          <p>
            6.1. Customer Satisfaction Meeting: If any aspect of our decor
            services falls short of your expectations, we initiate a meeting to
            understand your concerns.
          </p>
          <p>
            6.2. Thorough Evaluation: During the meeting, we conduct a
            comprehensive evaluation of the services provided.
          </p>
          <p>
            6.3. Refund Eligibility: Refunds will be considered for items or
            services that did not meet the agreed-upon standards.
          </p>
          <p>
            6.4. Discussion and Agreement: We engage in open and transparent
            discussions to reach a mutual agreement on eligible refund items.
          </p>
          <p>
            6.5. Refund Processing: Upon agreement, the refund process will be
            promptly initiated for the specific items or services identified
            during the evaluation.
          </p>
          <p>
            6.6. Customer-Centric Approach: Our goal is to ensure your complete
            satisfaction. We are committed to addressing your concerns and
            finding a resolution that aligns with our high standards of service.
          </p>
          <p>
            6.7. Incase of changes in the event date, Wedsy will make the best
            effort possible to accommodate the new event. Client must understand
            that last-minute changes can affect the quality of the final event
            and these changes are not necessarily the fault of the event
            planners.
          </p>
          <p>
            6.8. In case of cancellation of event, client has to notify Wedsy no
            later than 15 days prior to the scheduled date for all the services
            availed from Wedsy, failing which refund will not be processed.
          </p>
          <p>
            6.9. Incase any venue booking is done through us, we shall abide by
            the T&Cs put forth by the Venue Management and Wedsy will not be
            held responsible at any given point of time unless any commitment is
            given in writing/email.
          </p>
          <p>
            6.10. Based on the preliminary discussions with the client, Wedsy
            coordinator will compile a checklist and verify the same with the
            client before execution.
          </p>
          <p>
            6.11. Any commitment mentioned in the checklist will be fulfilled by
            Wedsy followed by a pre-function check.
          </p>
          <p>
            6.12. If any of the commitment made that has been paid for by the
            client could not be fulfilled by Wedsy, then the refund for the same
            will be made post discussion with the client.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">7. User Accounts</p>
          <p>
            You may need to create an account to use certain features of WEDSY.
            You are responsible for maintaining the confidentiality of your
            account information.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">8. Intellectual Property</p>
          <p>
            All content on WEDSY, including text, graphics, logos, and images,
            is the property of WEDSY and is protected by intellectual property
            laws.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">9. Limitation of Liability</p>
          <p>
            WEDSY is provided &quot;as is&quot; without any warranties. We are
            not liable for any damages, including but not limited to, direct,
            indirect, incidental, or consequential damages.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">10. Governing Law</p>
          <p>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of [Your Jurisdiction].
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">
            11. Changes to Terms and Conditions
          </p>
          <p>
            We may update these Terms and Conditions from time to time. Any
            changes will be posted on this page, and the effective date will be
            updated.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">12. Contact Us</p>
          <p>
            If you have questions or concerns about our Terms and Conditions,
            please contact us at [
            <Link href={`mailto:contact@wedsy.in`}>contact@wedsy.in</Link>]
          </p>
        </div>
      </div>
    </div>
  );
}
