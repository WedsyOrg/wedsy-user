import { MdShare } from "react-icons/md";
import { RWebShare } from "react-web-share";

export default function EventToolShareButton({ eventName, eventId }) {
  return (
    <>
      <RWebShare
        data={{
          title: `EventPlanner - ${eventName}`,
          text: `Check out the Wedsy's event plan for ${eventName}.`,
          url: `https://wedsy.in/event/${eventId}/view`,
        }}
        onClick={() => console.log("Event shared successfully!")}
      >
        <MdShare className="ml-1" cursor={"pointer"} />
      </RWebShare>
    </>
  );
}
