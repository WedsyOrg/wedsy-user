import { Modal, Textarea } from "flowbite-react";
import Image from "next/image";

export default function NotesModal({
  notes,
  setNotes,
  UpdateNotes,
  allowEdit,
}) {
  return (
    <>
      <Modal
        show={notes?.open || false}
        size="lg"
        popup
        onClose={() =>
          setNotes({
            open: false,
            edit: false,
            loading: false,
            event_id: "",
            eventDay: "",
            decor_id: "",
            package_id: "",
            admin_notes: "",
            user_notes: "",
            notes: [],
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Notes
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {notes?.notes?.map((i, iIndex) => (
                <div className="grid grid-cols-3 gap-2" key={iIndex}>
                  <Textarea
                    rows={3}
                    value={i.text}
                    readOnly={true}
                    className="col-span-2"
                  />
                  {i.image && (
                    <Image
                      src={i.image}
                      alt="Decor"
                      sizes="100%"
                      width={0}
                      height={0}
                      className="w-full h-auto"
                    />
                  )}
                </div>
              ))}
            </div>
            <Textarea
              rows={4}
              value={notes?.user_notes}
              onChange={(e) => {
                setNotes({ ...notes, user_notes: e.target.value });
              }}
              readOnly={!allowEdit || !notes?.edit}
            />
            {allowEdit && (
              <button
                className={`text-white bg-rose-900  border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
                onClick={() => {
                  if (!notes?.edit) {
                    setNotes({ ...notes, edit: true });
                  } else {
                    UpdateNotes();
                  }
                }}
              >
                {notes?.edit ? "Save Notes" : "Edit Notes"}
              </button>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
