//signup
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3458;
const jwt = require("jsonwebtoken");
const app = express();
const { randomUUID } = require("crypto");
app.set("trust proxy", 1); 
const db = require("./db/database");
const e = require("express");
const {Server} = require('socket.io');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http=require('http');
const multer = require("multer");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
const JWT_SECRET = process.env.JWT_SECRET || "change-this-jwt-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
app.use(cors({
  origin: "*",
  credentials: true
}));

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.ROWID, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}


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

const accessToken = generateAccessToken(user);


    return res.status(200).json({
      message: "Login successful",
      username: user.username,
      accessToken
    });
  });
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    req.user = decoded;
    next();
  });
}

app.get("/session", requireAuth, (req, res) => {
  return res.status(200).json({
    userId: req.user.userId,
    username: req.user.username
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
let roomUsers = {};
const roomControlSettings = {};

function emitRoomUsers(roomName) {
  const members = roomUsers[roomName] || [];
  io.to(roomName).emit("roomUsersUpdated", members);
}


io.on("connection", (socket) => {


  socket.on("addtoserver", (username) => {

    users[username] = socket.id;
    console.log(users);

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

  socket.on('joinRoom', (roomName, username) => {
    let friend = username;
    socket.join(roomName);
    socket.data.username = username;
    socket.data.roomName = roomName;
    if (!roomUsers[roomName]) {
      roomUsers[roomName] = [];
    }
    
    if (!roomUsers[roomName].includes(username)) {
      roomUsers[roomName].push(username);
    }
    console.log(username + ` joined room: ${roomName}`);
    socket.to(roomName).emit("newJoin", username);
    socket.to(roomName).emit("newJoin", friend);
    emitRoomUsers(roomName);
  });

  socket.on("requestRoomUsers", (roomName) => {
    emitRoomUsers(roomName);
    if (roomControlSettings[roomName] !== undefined) {
      io.to(roomName).emit("hostControlUpdated", roomControlSettings[roomName]);
    }
  });

  socket.on("exit", (username, roomName) => {
    if (!username || !roomName) {
      return;
    }

    const checkHostQuery = `
    SELECT p.Role
    FROM participants p
    JOIN Rooms r ON r.RoomID = p.RoomID
    JOIN users u ON u.ROWID = p.userID
    WHERE r.RoomName = ? AND u.username = ?
    LIMIT 1
  `;

  db.query(checkHostQuery, [roomName, username], (err, result) => {
    if (err) {
      console.log("Error while checking host role on exit", err);
      const checkHostQuery = `
      SELECT p.Role
      FROM participants p
      JOIN Rooms r ON r.RoomID = p.RoomID
      JOIN users u ON u.ROWID = p.userID
      WHERE r.RoomName = ? AND u.username = ?
      LIMIT 1
    `;

    db.query(checkHostQuery, [roomName, username], (err, result) => {
      if (err) {
        console.log("Error while checking host role on exit", err);
        socket.to(roomName).emit("frndLeave", `${username} exited the room`);
        return;
      }

      const isHost = result?.length > 0 && result[0].Role === "Host";

      if (!isHost) {
        socket.to(roomName).emit("frndLeave", `${username} exited the room`);
        return;
      }

      const deleteParticipantsQuery = `
        DELETE FROM participants
        WHERE RoomID = (SELECT RoomID FROM Rooms WHERE RoomName = ?)
      `;

      db.query(deleteParticipantsQuery, [roomName], (participantsErr) => {
        if (participantsErr) {
          console.log("Error while deleting participants on host exit", participantsErr);
          socket.to(roomName).emit("roomClosed", "Room closed as host closed the room");
          return;
        }

        const deleteRoomQuery = `DELETE FROM Rooms WHERE RoomName = ?`;
        db.query(deleteRoomQuery, [roomName], (deleteRoomErr) => {
          if (deleteRoomErr) {
            console.log("Error while deleting room on host exit", deleteRoomErr);
          }

          socket.to(roomName).emit("roomClosed", "Room closed as host closed the room");

          if (roomUsers[roomName]) {
            delete roomUsers[roomName];
          }
        });
      });
    });
      return;
    }

    const isHost = result?.length > 0 && result[0].Role === "Host";

    if (!isHost) {
      socket.to(roomName).emit("frndLeave", `${username} exited the room`);
      return;
    }

    const deleteParticipantsQuery = `
      DELETE FROM participants
      WHERE RoomID = (SELECT RoomID FROM Rooms WHERE RoomName = ?)
    `;

    db.query(deleteParticipantsQuery, [roomName], (participantsErr) => {
      if (participantsErr) {
        console.log("Error while deleting participants on host exit", participantsErr);
        socket.to(roomName).emit("roomClosed", "Room closed as host closed the room");
        return;
      }

      const deleteRoomQuery = `DELETE FROM Rooms WHERE RoomName = ?`;
      db.query(deleteRoomQuery, [roomName], (deleteRoomErr) => {
        if (deleteRoomErr) {
          console.log("Error while deleting room on host exit", deleteRoomErr);
        }

        socket.to(roomName).emit("roomClosed", "Room closed as host closed the room");

        if (roomUsers[roomName]) {
          delete roomUsers[roomName];
        }
        delete roomControlSettings[roomName];
      });
    });
  });
  });


  socket.on('leaveRoom',(username,roomName)=>{
    socket.leave(roomName);
    roomUsers[roomName] = (roomUsers[roomName] || []).filter((member) => member !== username);
    if (roomUsers[roomName]?.length === 0) {
      delete roomUsers[roomName];
      delete roomControlSettings[roomName];
    } else {
      emitRoomUsers(roomName);
    }
    console.log(username+" leave the room ");
  })

  socket.on("webrtcOffer", ({ to, from, offer }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("webrtcOffer", { from, offer });
    }
  });

  socket.on("webrtcAnswer", ({ to, from, answer }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("webrtcAnswer", { from, answer });
    }
  });

  socket.on("webrtcIceCandidate", ({ to, from, candidate }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("webrtcIceCandidate", { from, candidate });
    }
  });

  socket.on('sendMessageInsideRoom', (room, msgObj) => {
    socket.to(room).emit("messageFromRoom", msgObj);
  });

  socket.on("Startparty", (room) => {
    console.log("Party started in:", room);
    io.to(room).emit("partystarted");
  });

  socket.on("VideoPaused", (roomname, role) => {
    if (roomControlSettings[roomname] && role !== "Host") {
      socket.emit("hostControlDenied");
      return;
    }

    socket.broadcast.to(roomname).emit("pauseTheVideo");
  });
  
  socket.on("VideoPlayed", (roomname, role) => {
    if (roomControlSettings[roomname] && role !== "Host") {
      socket.emit("hostControlDenied");
      return;
    }

    socket.broadcast.to(roomname).emit("playTheVideo");
  });
  socket.on("VideoSeek", ({ room, time, role }) => {
    if (roomControlSettings[room] && role !== "Host") {
      socket.emit("hostControlDenied");
      return;
    }

    socket.broadcast.to(room).emit("updateSeek", time);
  });

  socket.on("requestResumeTime", (username, hostName) => {
    if (!users[hostName]) return;
    io.to(users[hostName]).emit("provideCurrentTime", username);
  });


  socket.on("setHostControl", ({ roomName, enabled }) => {
    if (!roomName || typeof enabled !== "boolean") return;

    roomControlSettings[roomName] = enabled;
    io.to(roomName).emit("hostControlUpdated", enabled);
    const updateHostControlQuery = `UPDATE Rooms SET Audiocall = ? WHERE RoomName = ?`;
    db.query(updateHostControlQuery, [enabled ? 1 : 0, roomName], (err) => {
      if (err) {
        console.log("Error while persisting host control setting", err);
      }
    });
  });

  socket.on("requestHostControl", (roomName) => {
    if (!roomName || roomControlSettings[roomName] === undefined) return;
    socket.emit("hostControlUpdated", roomControlSettings[roomName]);
  });

  socket.on("middlejoin",(username,roomname,hostname)=>{
    io.to(users[hostname]).emit("latejoin",username);
  })
  
  // socket.emit("toSetTime",currenttime,username);

  socket.on("summary",(result,username)=>{
    io.to(users[username]).emit("summaryFromHost",result);
  })

  socket.on('sendEmoji',(room,emoji)=>{
    socket.broadcast.to(room).emit('receiveEmoji',emoji);
  })

  socket.on("cameraStateChanged", ({ room, username, state }) => {
    if (!room || !username) return;

    socket.to(room).emit("cameraStateChanged", {
      username,
      state: !!state
    });
  });

  
  // socket.emit("toSetTime",currenttime,username);

  socket.on("toSetTime",(time,username)=>{
    io.to(users[username]).emit("setCurrentTime",time);
  })

  socket.on("disconnect", () => {

    const { username, roomName } = socket.data;
    if (username && roomName && roomUsers[roomName]) {
      roomUsers[roomName] = roomUsers[roomName].filter((member) => member !== username);
      if (roomUsers[roomName].length === 0) {
        delete roomUsers[roomName];
        delete roomControlSettings[roomName];
      } else {
        emitRoomUsers(roomName);
      }
    }

    for (let user in users) {

      if (users[user] === socket.id) {
        console.log("User disconnected: " + user);
        delete users[user];

        break;

      }

    }

  });

  socket.on("sendInvite", (room_code, sender_name, movie_name, receiver_name, video, image) => {
    let friend = users[receiver_name];
    console.log(users, " Send Invite");
    if (friend) {
      io.to(friend).emit("sendingInvite", room_code, movie_name, sender_name, video, image);
    }
  })

});

app.post("/startparty",(req,res)=>{
  const {roomname} = req.body;
  let tostart = `UPDATE Rooms SET RoomStatus = 'Running' WHERE RoomName = ?;`;
  db.query(tostart,[roomname],(err,result)=>{
    if(err){
      return res.json("Error in start update");
    }
    else{
      return res.json("Updated successfully");
    }
  })

})

app.post("/getHostName",(req,res)=>{
  let {roomname} = req.body;
  let role = "Host";
  let gethostname = `SELECT username from users where ROWID = (Select userID from participants where Role = ? AND RoomID = (select RoomID from Rooms where RoomName = ?))`;

  db.query(gethostname,[role,roomname],(err,result)=>{
    if(err){
      return res.json({"Error":err})
    }
    else{
      console.log(result);
      return res.json({
        hostname:result
      });
    }
  })
})
app.post("/roomcheck",(req,res)=>{
  const {roomCode} = req.body;
  console.log(roomCode);
  let tocheck = `SELECT * FROM Rooms WHERE RoomCode = ? AND RoomStatus=?`;
  db.query(tocheck,[roomCode,"Running"],(err,result)=>{
    if(err){
      return res.json("Error in check");
    }
    else{
      return res.json({
        result:result
      });
    }
  })
})
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

app.post("/clearInvitations", (req, res) => {
  let { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  let deleteInvitations = "DELETE FROM RoomInvitations WHERE receiver_name = ?";

  try {
    db.query(deleteInvitations, [username], (err) => {
      if (err) {
        return res.json({ error: err });
      }

      return res.json({ message: "All invitations cleared" });
    });
  }
  catch (err) {
    return res.status(500).json({ error: "Error in server side while clearing invitations" });
  }
})

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
    const { username, room, password, hostControl = true, movieId } = req.body;

    if (!username) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!room) {
      return res.status(400).json({ message: "Room Name is Required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Room password is required" });
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

    const roomCode = await createRoom(room, password, userID, hostControl, movieId);
    roomControlSettings[room] = Boolean(hostControl);

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


async function createRoom(room, password, userID, hostControl, movie_id) {
  const roomCode = randomUUID();
  await queryAsync(
  "insert into Rooms(RoomName,RoomCode,RoomPassword,OwnerID,Chat,VideoCall,Audiocall,Emoji,PredictionGame,movie_id) values(?,?,?,?,?,?,?,?,?,?)",
  [room, roomCode, password, userID, false, false, Boolean(hostControl), false, false, movie_id]
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


app.post("/removeFavorite",(req,res)=>{
  const {username,movie_name,movieYear}=req.body;
  if (!username) {
    console.log("No username provided!");
    return res.status(400).json({ error: "Username required" });
  }
  console.log(username,movie_name,movieYear)
  db.query("SELECT ROWID FROM users WHERE username=?", [username], (err, userResult) => {
    if (err) return res.status(500).json({ error: err });
    if (!userResult.length)
      return res.json({ error: "User not found" });

    const userID = userResult[0].ROWID;
    db.query("select ROWID from Movies where title=? and year=?",[movie_name,movieYear],(err,result)=>{
      if(err)return res.status(500).json({ error: err });
      if(! result.length) return res.json({error:"Movie Not Found"});
      let movie_id=result[0].ROWID;


      db.query("Delete from FavoriteMovie where userID=? and movieID=?", [userID,movie_id], (err, nameResult) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ result: userID });
      });
    })

    });
  });

  app.post("/searchFavorite",(req,res)=>{
    const {username,movie_name,movieYear}=req.body;
    if (!username) {
      console.log("No username provided!");
      return res.status(400).json({ error: "Username required" });
    }
    console.log(username,movie_name,movieYear)
    db.query("SELECT ROWID FROM users WHERE username=?", [username], (err, userResult) => {
      if (err) return res.status(500).json({ error: err });
      if (!userResult.length)
        return res.json({ error: "User not found" });
  
      const userID = userResult[0].ROWID;
      db.query("select ROWID from Movies where title=? and year=?",[movie_name,movieYear],(err,result)=>{
        if(err)return res.status(500).json({ error: err });
        if(! result.length) return res.json({error:"Movie Not Found"});
        let movie_id=result[0].ROWID;
  
  
        db.query("select * from FavoriteMovie where userID=? and movieID=?", [userID,movie_id], (err, nameResult) => {
          if (err) return res.status(500).json({ error: err });
          if(nameResult.length ==0){
            return res.status(200).json({ error: 'movie not favorite' });
          }
          return res.json({ result: userID });
        });
      })
  
      });
    });


    app.post("/sendInvitation", (req, res) => {
      const {
        room_name,
        room_code,
        sender_name,
        reciever_name,
        receiver_name,
        movie_name,
        video,
        image
      } = req.body;
    
      const invitationReceiver = receiver_name || reciever_name;
    
      if (!room_name || !room_code || !sender_name || !invitationReceiver || !movie_name) {
        return res.status(400).json({
          error: "room_name, room_code, sender_name, receiver_name and movie_name are required"
        });
      }
    
      const savenotification = "INSERT INTO RoomInvitations (sender_name, receiver_name,room_name,room_code,movie_name,video,image) VALUES (?,?,?,?,?,?,?);";
    
      db.query(savenotification, [sender_name, invitationReceiver, room_name, room_code, movie_name, video, image], (err, result) => {
        if (err) {
          console.log("Error while inserting notification", err);
          return res.status(500).json({
            error: err
          });
        }
        return res.json({
          result
        });
      });
    
    });
    

app.get("/getFeelsForever",(req,res)=>{

  db.query(
    `SELECT movie_poster, title, rating, year, overview, director, lead_cast 
     FROM Movies 
     WHERE ROWID IN (
        SELECT movie_id 
        FROM MovieCategoryRelation 
        WHERE category_id = 9
     )
     LIMIT 5`,
    (err, movieResult) => {

      if (err) return res.status(500).json({ error: err });

      if (!movieResult.length)
        return res.json({ result: [] });

      return res.json({ result: movieResult });
    }
  );

});


app.post("/getInvitations", (req, res) => {
  let { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  let getNotification = `
  SELECT sender_name, room_name, room_code, movie_name, created_at,video,image
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
  let deleteInvitation = "DELETE FROM RoomInvitations WHERE room_code = ?";

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

  const { roomCode, password } = req.body;

  if (!roomCode || !password) {
    return res.status(400).json({ message: "roomCode and password are required" });
  }

  const query = `
    SELECT 
      r.RoomName as roomname,
      m.movie_url,
      m.movie_poster,
      m.title,
      r.Audiocall as hostControl
    FROM Rooms r
    JOIN Movies m
      ON r.movie_id = m.ROWID
    WHERE r.RoomCode = ? AND r.RoomPassword = ?
  `;

  db.query(query, [roomCode, password], (err, result) => {

    if (err) {
      return res.json({ error: err });
    }

    if (result.length === 0) {
      return res.json({ message: "Room not found" });
    }

    res.json(result[0]);
  });
});

app.post("/getRoomById", (req, res) => {

  const { roomCode } = req.body;

  if (!roomCode) {
    return res.status(400).json({ message: "roomCode is required" });
  }

  const query = `
    SELECT 
      r.RoomName as roomname,
      m.movie_url,
      m.movie_poster,
      m.title
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



app.post("/editProfile", upload.single("image"), (req, res) => {
  const { oldname, image, name, bio } = req.body;
  const imageFile = req.file;
  const imageBase64 = imageFile ? imageFile.buffer.toString("base64") : null;

  db.query("SELECT ROWID FROM users WHERE username=?", [oldname], (err, userResult) => {
    if (err) return res.status(500).json({ error: err });
    if (!userResult.length)
      return res.json({ error: "User not found" });

    const userID = userResult[0].ROWID;

    db.query("SELECT ROWID FROM users WHERE username=?", [name], (err, nameResult) => {
      if (err) return res.status(500).json({ error: err });

      if (nameResult.length && name !== oldname) {
        return res.json({ error: "User already exists" });
      }

      const alterQuery = "UPDATE users SET image=?, username=?, bio=? WHERE ROWID=?";
      db.query(alterQuery, [imageBase64, name, bio, userID], (err,result) => {
        if (err) return res.status(500).json({ error: err });

        return res.json({ result: userID });
      });
    });
  });
});
app.post("/getMyProfile", (req, res) => {
  const { username } = req.body;
  console.log("username:", username);

  if (!username) {
    console.log("No username provided!");
    return res.status(400).json({ error: "Username required" });
  }

  db.query(
    "SELECT bio, image, username FROM users WHERE username=?",
    [username],
    (err, userResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (!userResult.length) {
        console.log("User not found in DB");
        return res.status(404).json({ error: "User not found" });
      }
      const user = userResult[0];

      console.log("DB result:", user);
      return res.json({ message: user });
    }
  );
});

app.post("/addFavorite",(req,res)=>{
  const {username,movie_name,movieYear}=req.body;
  if (!username) {
    console.log("No username provided!");
    return res.status(400).json({ error: "Username required" });
  }
  console.log(username,movie_name,movieYear)
  db.query("SELECT ROWID FROM users WHERE username=?", [username], (err, userResult) => {
    if (err) return res.status(500).json({ error: err });
    if (!userResult.length)
      return res.json({ error: "User not found" });

    const userID = userResult[0].ROWID;
    db.query("select ROWID from Movies where title=? and year=?",[movie_name,movieYear],(err,result)=>{
      if(err)return res.status(500).json({ error: err });
      if(! result.length) return res.json({error:"Movie Not Found"});
      let movie_id=result[0].ROWID;


      db.query("Insert into FavoriteMovie(userID,movieID) values(?,?)", [userID,movie_id], (err, nameResult) => {
        if (err) return res.status(500).json({ error: err });

        return res.json({ result: userID });
      });

    })

    });
  });

  app.post("/getMyFavoriteMovie",(req,res)=>{
    const {username}=req.body;
    if (!username) {
      console.log("No username provided!");
      return res.status(400).json({ error: "Username required" });
    }
    db.query("SELECT ROWID FROM users WHERE username=?", [username], (err, userResult) => {
      if (err) return res.status(500).json({ error: err });
      if (!userResult.length)
        return res.json({ error: "User not found" });
  
      const userID = userResult[0].ROWID;
      db.query("SELECT movie_poster, title, rating, year, overview, director, lead_cast FROM Movies WHERE ROWID IN (SELECT movieID FROM FavoriteMovie WHERE userID=?)",[userID],(err,movieReslt)=>{
        if (err) return res.status(500).json({ error: err });
    if (!movieReslt.length)
      return res.json({ error: "User not found" });
        return res.json({result:movieReslt});
      })
    });
  })


  app.get("/getTrendingMovie",(req,res)=>{

      db.query("SELECT movie_poster, title, rating, year, overview, director, lead_cast FROM Movies WHERE ROWID IN (SELECT movie_id FROM MovieCategoryRelation WHERE category_id=8) limit 5",(err,movieReslt)=>{
        if (err) return res.status(500).json({ error: err });
    if (!movieReslt.length)
      return res.json({ error: err });
        return res.json({result:movieReslt});
      })

  })