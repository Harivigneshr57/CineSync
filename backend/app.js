//signup
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3458;
const app = express();
app.set("trust proxy", 1); 
const db = require("./db/database");
const e = require("express");
const {Server} = require('socket.io');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http=require('http');
app.use(cors({
  origin: "*",
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["polling", "websocket"]
});


  
server.listen(port, (err) => {
    if (err) {
        console.log(err)
        console.log("Error in starting server", port);
    }
    console.log("Server", port);
})

app.post("/signin", async (req, res) => {
  console.log('signin called ......');
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "All fields required"
    });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Query failed",
        error: err
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      username: user.username,
    });
  });
});

app.get("/userId", async (req,res)=>{
  try{

  }
  catch(error){

  }
})
  app.post("/signup", async (req, res) => {
    console.log('fetch working.....');
    try {
      const { username, password } = req.body;
  
          if (!username.trim() || !password.trim()) {
        return res.status(400).json({
          message: "All fields required"
        });
      }
  
      const checkQuery = "SELECT ROWID FROM users WHERE username = ?";
  
      db.query(checkQuery, [username], async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Query failed",
            error: err
          });
        }
  
        if (result.length > 0) {
          return res.status(409).json({
            message: "User already exists"
          });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const insertQuery =
          "INSERT INTO users (username, password) VALUES (?, ?)";
  
        db.query(insertQuery, [username, hashedPassword], (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Insert failed",
              error: err
            });
          }
  
          return res.status(201).json({
            message: "Signup successful",
            username: username
          });
        });
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error : "+error });
    }
  });

  app.post("/reqfriends", (req, res) => {
    const { username } = req.body;
  
    db.query("SELECT ROWID FROM users WHERE username=?", [username], (err, result) => {
  
      if (err) return res.status(500).json({ error: err });
  
      if (result.length === 0) {
        return res.json({ message: "User not found" });
      }
  
      const myId = result[0].ROWID;
  
      db.query(
        "SELECT from_person_id FROM FriendRequest WHERE status=0 AND to_person_id=?",
        [myId],
        (err, friendResult) => {
  
          if (err) return res.status(500).json({ error: err });
  
          if (friendResult.length === 0) {
            return res.json({ message: "FriendRequest not found" });
          }
  
          const ids = friendResult.map(f => f.from_person_id);
  
          db.query(
            `SELECT username, image, bio FROM users WHERE ROWID IN (${ids.map(()=>"?").join(",")})`,
            ids,
            (err, usersResult) => {
              if (err) return res.status(500).json({ error: err });
  
              return res.json({ result: usersResult });
            }
          );
        }
      );
    });
  });
  
app.post("/allUsers",(req,res)=>{
    console.log('all users called .......');
    const {username}=req.body;
    const allUsersQuery = `Select image,username from users where username!=?`;

    console.log("username",username);
    db.query(allUsersQuery, [username], (err, result) => {
        if (err) {
            console.log("error", err);

            return res.json({
                error: err
            })
        }
        if (result.length == 0) {
            console.log("leng");
            return res.json({
              result: result
          });
          
        }
            console.log("leng");

            return res.json({
                result
            })
    })
})
app.post("/allfriends",(req,res)=>{
    console.log('all friends called .......');
    const {username}=req.body;
    console.log("USERNAME RECEIVED:", username);

    const allFriendsQuery = `SELECT u.username, u.bio, u.image FROM users u JOIN FriendRequest f ON (u.ROWID = f.from_person_id OR u.ROWID = f.to_person_id) WHERE f.status = 1 AND (  f.from_person_id = (SELECT ROWID FROM users WHERE username = ?) OR f.to_person_id = (SELECT ROWID FROM users WHERE username = ?)) AND u.username != ?;`;
    console.log("username", username);

    db.query(allFriendsQuery, [username,username,username], (err, result) => {
        if (err) {
            console.log("error", err);

            return res.json({
                error: err
            })
        }
        if (result.length == 0) {
            console.log("leng");
            return res.json({
              result: result
          });
          
        }
            console.log("leng");

            return res.json({
                result
            })
    })
})

// app.post("/sendRequest",(req,res)=>{
//     const {username,friendname}=req.body;
//     let friendID="";
// let userID="";
//     db.query("select ROWID from users where username=?", [username], (err, userResult) => {
//         userID = userResult[0].ROWID;
//      });
//      db.query("select ROWID from users where username=?", [friendname], (err, userResult) => {
//         friendID = userResult[0].ROWID;
//      });
     
//     const sendRequest=`insert into FriendRequest(from_person_id,to_person_id) values(?,?)`;

//     db.query(sendRequest, [userID,friendID], (err, result) => {
//         if (err) {
//             console.log("error", err);

//             return res.json({
//                 error: err
//             })
//         }
    
//             console.log("leng");

//             return res.json({
//                 result
//             })
        
//     })
// })
app.post("/sendRequest", (req, res) => {
  const { username, friendname } = req.body;

  db.query(
      "SELECT ROWID FROM users WHERE username=?",
      [username],
      (err, userResult) => {

          if (err) return res.json({ error: err });
          if (!userResult.length)
              return res.json({ message: "User not found" });

          const userID = userResult[0].ROWID;

          db.query(
              "SELECT ROWID FROM users WHERE username=?",
              [friendname],
              (err, friendResult) => {

                  if (err) return res.json({ error: err });
                  if (!friendResult.length)
                      return res.json({ message: "Friend not found" });

                  const friendID = friendResult[0].ROWID;

                  // check if already sent
                  db.query(
                      "SELECT * FROM FriendRequest WHERE from_person_id=? AND to_person_id=?",
                      [userID, friendID],
                      (err, existing) => {

                          if (existing.length > 0) {
                              return res.json({ message: "Request already sent" });
                          }

                          db.query(
                              "INSERT INTO FriendRequest(from_person_id,to_person_id,status) VALUES(?,?,0)",
                              [userID, friendID],
                              (err, result) => {

                                  if (err) return res.json({ error: err });

                                  return res.json({
                                      message: "Request sent successfully"
                                  });
                              }
                          );
                      }
                  );
              }
          );
      }
  );
});

app.post("/rejectRequest", (req, res) => {
  const { username, friendname } = req.body;

  db.query("SELECT ROWID FROM users WHERE username=?", [username], (err, userResult) => {

      if (err) return res.status(500).json({ error: err });
      if (!userResult.length)
          return res.json({ error: "User not found" });

      const userID = userResult[0].ROWID;

      db.query("SELECT ROWID FROM users WHERE username=?", [friendname], (err, friendResult) => {

          if (err) return res.status(500).json({ error: err });
          if (!friendResult.length)
              return res.json({ error: "Friend not found" });

          const friendID = friendResult[0].ROWID;

          db.query(
              "DELETE FROM FriendRequest WHERE from_person_id=? AND to_person_id=?",
              [friendID, userID],
              (err, result) => {

                  if (err) return res.status(500).json({ error: err });

                  return res.json({ message: "Request rejected" });
              }
          );
      });
  });
});


// app.post("/acceptRequest",(req,res)=>{
//     const {username,friendname}=req.body;
//     let friendID="";
// let userID="";
//     db.query("select ROWID from users where username=?", [username], (err, userResult) => {
//         userID = userResult[0].ROWID;
//      });
//      db.query("select ROWID from users where username=?", [friendname], (err, userResult) => {
//         friendID = userResult[0].ROWID;
//      });
//     const acceptRequest=`update FriendRequest set status=1 where from_person_id=? and to_person_id=?`;

//     db.query(acceptRequest, [userID,friendID], (err, result) => {
//         if (err) {
//             console.log("error", err);

//             return res.json({
//                 error: err
//             })
//         }
//             console.log("leng");

//             return res.json({
//                 result
//             })
        
//     })
// })
app.post("/acceptRequest", (req, res) => {
  const { username, friendname } = req.body;

  console.log("=================================");
  console.log("ACCEPT REQUEST API CALLED");
  console.log("Received username:", username);
  console.log("Received friendname:", friendname);

  db.query("SELECT ROWID FROM users WHERE username = ?", [username], (err, userResult) => {

      if (err) return res.status(500).json({ error: err });
      if (!userResult.length) {
          console.log("User not found");
          return res.json({ error: "User not found" });
      }

      const userID = userResult[0].ROWID;

      db.query("SELECT ROWID FROM users WHERE username = ?", [friendname], (err, friendResult) => {

          if (err) return res.status(500).json({ error: err });
          if (!friendResult.length) {
              console.log("Friend not found");
              return res.json({ error: "Friend not found" });
          }

          const friendID = friendResult[0].ROWID;

          console.log("Resolved userID:", userID);
          console.log("Resolved friendID:", friendID);

          db.query(
              `UPDATE FriendRequest 
               SET status = 1 
               WHERE from_person_id = ? 
               AND to_person_id = ?`,
              [friendID, userID],
              (err, updateResult) => {

                  if (err) return res.status(500).json({ error: err });

                  console.log("Affected rows:", updateResult.affectedRows);

                  if (updateResult.affectedRows === 0) {
                      return res.json({ error: "Request not found" });
                  }

                  console.log("Friend request accepted");
                  console.log("=================================");

                  return res.json({ message: "Friend request accepted" });
              }
          );
      });
  });
});

app.post("/savemessage", (req, res) => {
  const { message, username, friend } = req.body;
  const savequery = "INSERT into messages(from_user,to_user,message) values(?,?,?)";

  db.query(savequery, [username, friend, message], (err, result) => {
      if (err) {
          console.log("error", err);
          return res.json({
              error: err
          })
      }
      return res.json({
          result
      })

  })
})

app.post("/getmessage", (req, res) => {
  const { username, friend } = req.body;

  const sql = `
    SELECT message, from_user, to_user
    FROM messages
    WHERE 
    (from_user = ? AND to_user = ?)
    OR
    (from_user = ? AND to_user = ?)
`;

  db.query(sql, [username, friend, friend, username], (err, results) => {
      if (err) {
          console.log("error", err);
          return res.json({ error: err });
      }

      let messagesarray = [];

      for (let i = 0; i < results.length; i++) {
          let row = results[i];

          if (row.from_user === username) {
              messagesarray.push({
                  role: "our",
                  message: row.message
              });
          } else {
              messagesarray.push({
                  role: "friend",
                  message: row.message
              });
          }
      }

      return res.json({
          message: messagesarray
      });
  });
});

let users = {};        
let socketUsers = {};

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);



  socket.on("addtoserver", (username) => {

    users[username] = socket.id;
    socketUsers[socket.id] = username;

    console.log("Active users:", users);
  });


  socket.on("one2one", (message, friend, username) => {

    const friendSocket = users[friend];

    if (friendSocket) {
      io.to(friendSocket).emit(
        "privatemessage",
        message,
        username
      );
    }
  });


  socket.on("joinRoom", (roomName, username) => {

    socket.join(roomName);

    console.log(`${username} joined ${roomName}`);

    const room = io.sockets.adapter.rooms.get(roomName);

    const usersInRoom = room
      ? [...room].filter(id => id !== socket.id)
      : [];

    socket.emit("all-users", usersInRoom);

    socket.to(roomName).emit("user-joined", socket.id);
  });


  socket.on("sendMessageInsideRoom", (room, msgObj) => {
    socket.to(room).emit("messageFromRoom", msgObj);
  });

  socket.on("Startparty", (room) => {
    io.to(room).emit("partystarted");
  });

  socket.on("VideoPaused", (roomname) => {
    socket.to(roomname).emit("pauseTheVideo");
  });

  socket.on("VideoPlayed", (roomname) => {
    socket.to(roomname).emit("playTheVideo");
  });

  socket.on("VideoSeek", ({ room, time }) => {
    socket.to(room).emit("updateSeek", time);
  });

  socket.on(
    "sendInvite",
    (room_name, sender_name, movie_name, receiver_name, video, image) => {

      const friendSocket = users[receiver_name];

      if (friendSocket) {
        io.to(friendSocket).emit(
          "sendingInvite",
          room_name,
          movie_name,
          sender_name,
          video,
          image
        );
      }
    }
  );


  socket.on("offer", (data) => {

    if (!data?.to) return;

    socket.to(data.to).emit("offer", {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on("answer", (data) => {

    if (!data?.to) return;

    socket.to(data.to).emit("answer", {
      answer: data.answer,
      from: socket.id
    });
  });

  socket.on("ice-candidate", (data) => {

    if (!data?.to) return;

    socket.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id
    });
  });

  socket.on("disconnect", () => {

    const username = socketUsers[socket.id];

    if (username) {
      delete users[username];
      delete socketUsers[socket.id];

      console.log("User disconnected:", username);
    }

    socket.broadcast.emit("user-disconnected", socket.id);
  });

});
app.get("/getAllMovies", (req, res) => {

  const sql = `
    SELECT 
      m.ROWID,
      m.title,
      m.overview,
      m.rating,
      m.year,
      c.Category_Name,
      m.movie_poster,
      m.movie_url,
      m.lead_cast,
      m.director
    FROM Movies m
    INNER JOIN MovieCategoryRelation mc 
      ON m.ROWID = mc.movie_id
    INNER JOIN Category c 
      ON c.ROWID = mc.category_id
    ORDER BY c.Category_Name
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Join Query Error:", err);
      return res.status(500).json({
        message: "Failed to fetch movies",
        error: err
      });
    }

    console.log(result);

    return res.status(200).json({
      message: "Movies retrieved successfully",
      movies: result
    });
  });
});

app.get("/getAllMovie", (req, res) => {

  const sql = `
  SELECT 
  m.ROWID,
  m.title,
  m.overview,
  m.rating,
  m.year,
  GROUP_CONCAT(c.Category_Name SEPARATOR ', ') AS Category_Name,
  m.movie_poster,
  m.movie_url,
  m.lead_cast,
  m.director
FROM Movies m
INNER JOIN MovieCategoryRelation mc 
  ON m.ROWID = mc.movie_id
INNER JOIN Category c 
  ON c.ROWID = mc.category_id
GROUP BY m.ROWID
ORDER BY m.title;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Join Query Error:", err);
      return res.status(500).json({
        message: "Failed to fetch movies",
        error: err
      });
    }

    console.log(result);

    return res.status(200).json({
      message: "Movies retrieved successfully",
      movies: result
    });
  });
});


app.post("/addRoom", async (req, res) => {
  try {
    const { username, room, audio, video, reaction, chat, game } = req.body;

    if (!username) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!room) {
      return res.status(400).json({ message: "Room Name is Required" });
    }

    const user = await queryAsync(
      "select ROWID from users where username=?",
      [username]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User Not found" });
    }

    const userID = user[0].ROWID;

    const existingRoom = await queryAsync(
      "select * from Rooms where RoomName=? and RoomStatus!=?",
      [room, "End"]
    );

    if (existingRoom.length > 0) {
      return res.status(409).json({
        message: "Room Already Booked, Choose another name"
      });
    }

    const roomCode = await createRoom(room, userID, chat, video, audio, reaction, game);

    return res.status(200).json({
      message: "Room added successfully",
      code: roomCode
    });

  } catch (err) {
    return res.status(500).json({ error: err });
  }
});


function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}


async function createRoom(room, userID, chat, video, audio, reaction, game) {
  let roomCode;
  let exists = true;

  while (exists) {
    roomCode = Math.floor(Math.random() * 9000) + 1000;

    const result = await queryAsync(
      "select * from Rooms where RoomCode=? and RoomStatus!=?",
      [roomCode, "End"]
    );

    exists = result.length > 0;
  }

  await queryAsync(
    "insert into Rooms(RoomName,RoomCode,OwnerID,Chat,VideoCall,Audiocall,Emoji,PredictionGame) values(?,?,?,?,?,?,?,?)",
    [room, roomCode, userID, chat, video, audio, reaction, game]
  );

  return roomCode;
}

// app.post("/inviteToFriend",async(req,res)=>{
//   console.log("Inviteing");
//   try{
//     const{username,friendname}=req.body;
//     if (!username || !password) {
// return res.status(400).json({
//   message: "All fields required"
// });
//     }
//     const checkQuery="Select ROWID from users where username='?'";
//     db.query(checkQuery,[username],async(err,result)=>{
// if (err) {
//   return res.status(500).json({
//     message: "Query failed",
//     error: err
//   });
// }

//       if (result.length == 0) {
//         return res.status(409).json({
//           message: "User not found"
//         });
//       }
//       db.query(checkQuery,[friendname],async(err,result)=>{
//         if (err) {
//           return res.status(500).json({
//             message: "Query failed",
//             error: err
//           });
//         }

//         if (result.length == 0) {
//           return res.status(409).json({
//             message: "Friend not found"
//           });
//         }
// const sendRequestQuery="Insert into"
//       })
//     })
//   }
//   catch(err){

//   }
// })

async function getRoom(room, userID, chat, video, audio, reaction, game) {
  let roomCode = 1111;
  roomCode = Math.floor(Math.random() * 9000) + 1000;


  db.query('select * from Rooms where RoomCode =? and RoomStatus != ?', [roomCode, "End"], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      if (result.length > 0) {
        console.log("Room Already booked in this code");
        getRoom();
      }
    }
    console.log("--------------------\n", roomCode);
    let addRoomQuery = 'insert into Rooms(RoomName,RoomCode,OwnerID,Chat,VideoCall,Audiocall,Emoji,PredictionGame) values(?,?,?,?,?,?,?,?)';


    db.query(addRoomQuery, [room, roomCode, userID, chat, video, audio, reaction, game], (err, result) => {
      if (err) {
        console.log(err);
        return "err in adding room";
      }
      console.log("succes");
      return roomCode
    })
  })
  return roomCode
}

app.post("/sendInvitation", (req, res) => {
  let { room_name, sender_name, reciever_name, movie_name,video,image } = req.body;

  let savenotification = "INSERT INTO RoomInvitations (sender_name, receiver_name,room_name,movie_name,video,image) VALUES (?,?,?,?,?,?);";

  db.query(savenotification, [sender_name, reciever_name, room_name, movie_name, video,image], (err, result) => {
    if (err) {
      console.log("Error while inserting notification", err);
      return res.json({
        error: err
      })
    }
    return res.json({
      result
    })
  })

})

app.post("/getInvitations", (req, res) => {
  let { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  let getNotification = `
    SELECT sender_name, room_name, movie_name, created_at,video,image
    FROM RoomInvitations
    WHERE receiver_name = ?
    ORDER BY created_at DESC
  `;

  try {
    db.query(getNotification, [username], (err, result) => {
      if (err) {
        return res.json({ error: err });
      }

      return res.json({
        allnotification: result
      });
    });
  } catch (err) {
    return res.status(500).json({ error: "error in server" });
  }
});



app.post("/declineInvitation", (req, res) => {
  let { invitation } = req.body;
  let deleteInvitation = "DELETE FROM RoomInvitations WHERE room_name = ?";

  try {
    db.query(deleteInvitation, [invitation], (err, result) => {
      if (err) {
        return res.json({
          error: err
        })
      }
      return res.json({
        message: "Invitation deleted"
      })
    })
  }
  catch (err) {
    return res.status(500).json({ error: "Error in server side while deleting invitation" });
  }
})
app.post("/getAllParticipants", (req, res) => {

  let { roomName, userName } = req.body;

  if (!roomName || !userName) {
    return res.status(400).json({
      error: "roomName and userName required"
    });
  }

  let getAllmembers = `SELECT username 
  FROM users 
  WHERE ROWID IN (
    SELECT userId 
    FROM participants 
    WHERE RoomId = (
      SELECT RoomID 
      FROM Rooms 
      WHERE RoomName = ?
    )
  )`;
  try{
    db.query(getAllmembers,[roomName],(err,result)=>{
      if(!err){
        console.log("All members: "+result[0]);
        for(let i=0;i<result.length;i++){
          result[i].status = "Not Ready";
        }
        return res.json({
          allmembers: result
        });
      }else{
        console.log("Error in getAllmembers");
        return res.json({
          error:err
        })
      }
    })
  }
  catch(error){
    return res.json({error:error})
    console.log("Error "+error);
  }
});


app.post("/addToRoom",(req,res)=>{
  let {roomname,username,Role,status} =req.body;
  console.log(roomname);
  
  // let joinroom = `INSERT INTO participants (RoomID,userID,status,chat,videocall,audiocall,emoji,predictionGame,Role) VALUES ((SELECT RoomID from Rooms where RoomName =?),(SELECT ROWID from users where username =?),?,(SELECT Chat from Rooms where RoomName = ?),(SELECT VideoCall from Rooms where RoomName = ?),(SELECT AudioCall from Rooms where RoomName = ?),(SELECT Emoji from Rooms where RoomName = ?),(SELECT PredictionGame from Rooms where RoomName = ?),?);`;
  let joinroom = `INSERT INTO participants (RoomID,userID,status,chat,videocall,audiocall,emoji,predictionGame,Role) VALUES 
  ((SELECT RoomID from Rooms where RoomName = ?),
  (SELECT ROWID from users where username = ?),
  ?,
  1,
  1,
  1,
  1,
  (SELECT PredictionGame from Rooms where RoomName = ?)
  ,?);`;

  db.query(joinroom,[roomname,username,status,roomname,Role],(err,result)=>{
    if(err){
      console.log(err);
      
      return res.json({
        error:"Error in join room"
      })
    }
    else{
      return res.json({
        message:"Joined successfully"
      })
    }
  })

})

app.post("/getRoomName", (req, res) => {

  const { roomCode } = req.body;

  const query = `
    SELECT 
      r.RoomName as roomname,
      m.movie_url,
      m.movie_poster
    FROM Rooms r
    JOIN Movies m
      ON r.movie_id = m.ROWID
    WHERE r.RoomCode = ?
  `;

  db.query(query, [roomCode], (err, result) => {

    if (err) {
      return res.json({ error: err });
    }

    if (result.length === 0) {
      return res.json({ message: "Room not found" });
    }

    res.json(result[0]);
  });
});



app.post("/editProfile",(req,res)=>{
  const{oldname,image,name,bio}=req.body;

  let userID=0;
  let isNotExist=false;
  
  db.query("SELECT ROWID FROM users WHERE username=?", [oldname], (err, userResult) => {

    if (err) return res.status(500).json({ error: err });
    if (!userResult.length)
        return res.json({ error: "User not found" });

    userID = userResult[0].ROWID;
    console.log(userID);
  })
  db.query("SELECT ROWID FROM users WHERE username=?", [name], (err, userResult) => {

    if (err) return res.status(500).json({ error: err });
    if (userResult.length){
      return res.json({ error: "User already exist, please choose another name" });
      
    }
    else{
      console.log("User is unique")
      isNotExist=true;
      const alterQuery='update users set image=?, username=? ,bio=? where ROWID=?'
    db.query(alterQuery,[image,name,bio,userID],(err,userResult)=>{
      if(err) return res.status(500).json({error:err});
      if (!userResult.length) return res.json({ error: "User not found" });
      return res.json({message:userID});
    })
    }
  })
  // const insertQuery=`update users set image=?,username`
  
})
app.post("/getMyProfile",(req,res)=>{
  const{username,user_id}=req.body;
  db.query("Select bio, image,username from users where username=? and ROWID=?",[username,user_id],(err,userResult)=>{
    if(err) return res.status(500).json({error:err});
    if (!userResult.length) return res.json({ error: "User not found" });
    return res.json({message:userResult});
  });

})