import "./App.css";
import { useEffect, useState } from "react";
import aws_exports from "./aws-exports";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Profile from "./components/Profile";
import { API } from "aws-amplify";
import Amplify from "aws-amplify";

Amplify.configure(aws_exports);

function App() {
  const [sauces, setSauces] = useState([]);
  const [liked, setLiked] = useState(null);
  const [sauce, setSauce] = useState("");

  useEffect(() => {
    function getData() {
      API.get("newAPI", "/sauces", {})
        .then((result) => {
          setSauces(JSON.parse(result.body));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getData();
  }, []);

  function updateData(sauce) {
    const id = sauce.id;
    console.log(sauce);
    if (sauce.liked === false || sauce.liked == null) {
      setLiked(true);
      API.put("newAPI", "/sauces", {
        body: {
          id: id,
          liked: liked,
          comment: "🔥🔥 Damn thats spicy! 🔥🔥",
        },
      })
        .then((result) => {
          console.log("setting true", JSON.parse(result.body));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function dislikeData(sauce) {
    const id = sauce.id;
    console.log(sauce.liked);
    console.log(sauce);
    if (sauce.liked === true || sauce.liked == null) {
      setLiked(false);
      API.put("newAPI", "/sauces", {
        body: {
          id: id,
          liked: liked,
          comment: "🥱 Nothing to it 🥱",
        },
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function deleteData(id) {
    console.log("deleting...");
    API.del("newAPI", `/sauces/${id}`, {})
      .then((result) => {
        console.log("setting false", JSON.parse(result.body));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          <div className="loggedIn">
            <div className="welcome">
              <h1>Hey, {user.username}</h1>
              <Button className="ampbuttons" onClick={signOut}>Sign Out!</Button>
            </div>
            <Profile></Profile>

            <div className="card-container">
              {sauces.map((sauce) => (
                <div className="card" key={sauce.id}>
                  {/* Item ID: <p>{sauce.id}</p> */}
                  <h1>{sauce.name}</h1>
                  <img className="saucyimage" src={sauce.image} />
                  <br></br>
                  {sauce.comment}

                  <br></br>
                  <div className="buttons">
                  
                    <Button className="ampbuttons"
                      onClick={() => {
                        updateData(sauce);
                      }}
                    >
                      👍
                    </Button>
                    <Button className="ampbuttons"
                      onClick={() => {
                        dislikeData(sauce);
                      }}
                    >
                      👎
                    </Button>
                    <Button className="ampbuttons"
                      onClick={() => {
                        deleteData(sauce.id);
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
