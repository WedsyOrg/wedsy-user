export default function EventHowItWorks() {
  return (
    <div className="px-12 md:px-48 py-8 flex flex-col gap-12">
      <p className="font-medium text-[25px] md:text-3xl text-center md:text-center text-black">How it works?</p>
      <ol className="text-lg list-decimal flex flex-col gap-5" style={{ color: '#2B3F6C', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '100%', letterSpacing: '0%' }}>
        <li style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '500', marginBottom: '15px' }}>Name Your Event:</p>
          <p style={{ fontWeight: '400' }}>
            Give your event a personal touch. Whether it&#39;s &#34;Kiara&#39;s
            Wedding&#34; or &#34;RahulxKiara,&#34; your event starts with a name
            that reflects your style.
          </p>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '500', marginBottom: '15px' }}> Select the Community:</p>
          <p style={{ fontWeight: '400' }}>
            Choose your community to tailor the planning process to your
            specific rituals and traditions. If you are uncomfortable, You can
            always skip it
          </p>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '500', marginBottom: '15px' }}>Add Events:</p>
          <p style={{ fontWeight: '400' }}>
            Break down your main event into its unique components - Haldi,
            Sangeet, Wedding etc. . Add events one by one for us to capture the
            essence of each celebration.
          </p>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '500', marginBottom: '15px' }}>Set Date and Time:</p>
          <p style={{ fontWeight: '400' }}>
            Specify when each event will take place. This helps us understand
            the flow and timing of your festivities.
          </p>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '500', marginBottom: '15px' }}>Enter Venue Details:</p>
          <p style={{ fontWeight: '400' }}>
            Provide the name of the venue for each event. Understanding the
            logistics ensures a smooth execution of your plans.
          </p>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '500', marginBottom: '15px' }}> Multiple events:</p>
          <p style={{ fontWeight: '400' }}>
            If you have more than one sub event, easily include more by clicking
            the &#34;Add day&#34; button after you have added your first event.
          </p>
        </li>
      </ol>
      <p className="text-lg" style={{ color: '#2B3F6C', fontFamily: 'Montserrat', fontWeight: '400', lineHeight: '100%', letterSpacing: '0%' }}>
        Now, let&#39;s add the magic! Choose decor and services to make each
        event uniquely yours. Whether you take charge or let your wedding
        planner guide you, Wedsy&#39;s event tool ensures every detail aligns
        with your vision.
      </p>
    </div>
  );
}
