export function uploadFile({ file, id, path }) {
  return new Promise((resolve, reject) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("path", path);
    formdata.append("id", id);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/file`, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "AWS Upload Error") {
          reject(response.error);
        } else {
          resolve(response.url);
        }
      })
      .catch((error) => {
        reject(error);
        console.error("There was a problem uploading the file:", error);
      });
  });
}
