import { useState } from "react";
import { API, Storage } from "aws-amplify";
import { Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function Profile() {
  const [sauceComment, setSauceComment] = useState("");
  const [sauceName, setSauceName] = useState("");
  const [file, setFile] = useState();
  const [imgUrl, setImgUrl] = useState("");

  function randomString(bytes = 16) {
    return Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
      .map((b) => b.toString(16))
      .join("");
  }

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const postData = async (sauceName) => {
    const imageName = randomString();
    const resultS3 = await Storage.put(imageName, file);
    const imageUrl = await Storage.get(resultS3.key);
    const url = imageUrl.split('?')[0]
    API.post("newAPI", "/sauces", {
      body: {
        name: sauceName,
        image: url,
      },
    })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="profile">
      <div className="form">
        <form onSubmit={postData}>
          <input
            placeholder="enter name of sauce..."
            onChange={(e) => setSauceName(e.target.value)}
            type="text"
          />

          <br></br>
          <input id="files" onChange={fileSelected} type="file" accept="image/*"></input>
          {/* <label for="files">select file</label> */}
        </form>
        <Button onClick={()=>postData(sauceName)}>Post a new sauce</Button>
      </div>
    </div>
  );
}
