import { Badge } from "flowbite-react";

export default function EventDayInfo({ eventPlanner, tempEventDay, status }) {
  return (
    <>
      <div className="px-4 md:px-0 flex flex-col md:flex-row justify-between md:pr-8 mb-4 text-sm md:text-base font-normal md:font-medium">
        <div className="flex flex-col justify-between">
          <span className="flex flex-row justify-between">
            <span>
              {new Date(tempEventDay.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="md:hidden">
              {new Date("1970-01-01T" + tempEventDay.time).toLocaleTimeString(
                "en-US",
                { hour: "numeric", minute: "2-digit" }
              )}{" "}
              Onwards
            </span>
          </span>
          <span className="hidden md:block">
            {new Date("1970-01-01T" + tempEventDay.time).toLocaleTimeString(
              "en-US",
              { hour: "numeric", minute: "2-digit" }
            )}{" "}
            Onwards
          </span>
          <span>{tempEventDay.venue}</span>
        </div>
        <div className="hidden md:block">
          <span className="italic hidden md:block">
            Designated Planner : &nbsp;
            <span className="text-rose-900 font-semibold">{eventPlanner || ""}</span>
          </span>
          <span>
            {status.lost ? (
              <Badge color="failure" className="max-w-max ml-auto">
                Lost
              </Badge>
            ) : status.completed ? (
              <Badge color="gray" className="max-w-max ml-auto">
                Completed
              </Badge>
            ) : status.paymentDone ? (
              <Badge color="success" className="max-w-max ml-auto">
                Payment Completed
              </Badge>
            ) : status.approved ? (
              <Badge color="indigo" className="max-w-max ml-auto">
                Approved
              </Badge>
            ) : status.finalized ? (
              <Badge color="purple" className="max-w-max ml-auto">
                Finalized
              </Badge>
            ) : null}
          </span>
        </div>
      </div>
    </>
  );
}
