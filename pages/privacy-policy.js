import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 md:py-16 md:px-24">
      <h2 className="text-rose-900 font-semibold text-2xl">PRIVACY POLICY</h2>
      <p className="pt-8">
        Welcome to WEDSY! This Privacy Policy explains how we collect, use,
        disclose, and protect your personal information. By using our website,
        you agree to the terms outlined in this policy.
      </p>
      <div className="pt-6 flex flex-col gap-3 text-justify">
        <div>
          <p className="text-xl font-semibold">1. Information We Collect</p>
          <p className="font-medium text-lg">Personal Information </p>
          <p>
            We may collect personal information, such as your name, email
            address, shipping address, and payment details when you make a
            purchase on WEDSY.
          </p>
          <p className="font-medium text-lg">Usage Data</p>
          <p>
            We collect information about how you interact with our website,
            including your IP address, browser type, and pages visited. This
            helps us improve our services and enhance your experience.
          </p>
          <p className="font-medium text-lg">Cookies </p>
          <p>
            We use cookies to enhance your browsing experience. You can manage
            cookie preferences through your browser settings.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">
            2. How We Use Your Information
          </p>
          <p>
            We use your personal information for order fulfillment, customer
            service, and to improve our website. We may also use your email to
            send you promotional offers or updates if you opt-in.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">3. Data Sharing</p>
          <p>
            We do not sell or rent your personal information to third parties.
            However, we may share data with trusted service providers who help
            us operate our website and provide services to you.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">4. Security</p>
          <p>
            We take reasonable measures to protect your personal information.
            However, no method of transmission over the internet or electronic
            storage is entirely secure.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">5. Your Choices</p>
          <p>
            You can update your account information and preferences at any time.
            You may also opt-out of promotional emails by following the
            unsubscribe instructions.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">6. Children&apos;s Privacy</p>

          <p>
            WEDSY is not intended for individuals under the age of 13. We do not
            knowingly collect personal information from children. If you believe
            we have collected information from a child, please contact us.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">
            7. Changes to This Privacy Policy
          </p>
          <p>
            We may update our Privacy Policy from time to time. Any changes will
            be posted on this page, and the effective date will be updated.
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">8. Contact Us</p>
          <p>
            If you have questions or concerns about our Privacy Policy, please
            contact us at [
            <Link href={`mailto:contact@wedsy.in`}>contact@wedsy.in</Link>]
          </p>
        </div>
      </div>
    </div>
  );
}
