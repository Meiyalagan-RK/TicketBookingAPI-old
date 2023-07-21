let express = require("express");
let app = express();
let port = process.env.PORT||2001;
let Mongo = require("mongodb")
const cors = require("cors")
let {dbConnect,db, getData,postData,updateOrder,deleteOrder} = require("./controller/dbcontroller");
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

app.get("/",function(req,res){
    res.send("Hi from Express")
});

app.get("/locations",async function(req,res){
    let query ={};
    let collection = "Locations"
    let output = await getData(collection,query)
    res.send(output)
    console.log(output)
});

app.get("/Genres",async function(req,res){
    let query ={};
    let collection = "Genres"
    let output = await getData(collection,query)
    res.send(output)
    console.log(output)
});

app.get("/language",async function(req,res){
    let query ={};
    let collection = "Languages"
    let output = await getData(collection,query)
    res.send(output)
    console.log(output)
});

app.get("/movies",async function(req,res){
    let query ={};
    if(req.query.GenresId){
        query={Genres_id:Number(req.query.GenresId)}
    }
   else if(req.query.LanguageId){
        query={Lang_id:Number(req.query.LanguageId)}
   }
   else if(req.query.MovieId){
        query={movie_id:Number(req.query.MovieId)}
   }
    else{
        let query ={};
    }
    let collection ="Movies"
    let output = await getData(collection,query)
    res.send(output)
    console.log(output)
});

app.get("/theatre",async function(req,res){
    let query ={};

    if(req.query.StateId){
        query={state_id:Number(req.query.StateId)}
    }
    else{
        let query ={};
    }

    let collection ="Theatre"
    let output = await getData(collection,query)
    res.send(output)
    console.log(output)
    
    console.log()
});


// app.get('/filter/:movieId', async(req,res) => {
//     let movieId = Number(req.params.movieId);
//     let LangId = Number(req.query.LangId)
//     let lcost = Number(req.query.lcost)
//     let hcost = Number(req.query.hcost)
//     if(lcost && hcost){
//         query = {
//             "2D-Movies.movie_id":movieId,
//             $and:[{movie_price:{$gt:lcost,$lt:hcost}}]
//         }
//     }

//     // if(LangId){
//     //     query = {
//     //         "2D-Movies.movie_id":movieId,
//     //         "3D-Movies.movie_id":LangId
//     //     }
//     // } 
//     else{
//         query = {}
//     }
//     let collection = "Theatre";
//     let output = await getData(collection,query);
//     res.send(output)
// })

// details
app.get('/details/:id', async(req,res) => {
    let id = Number(req.params.id)
    let query = {Theatre_id:id}
    let collection = "Theatre";
    let output = await getData(collection,query);
    res.send(output)
})
// let id = Number(req.params.id);
// let id = Number(new Mongo.ObjectId)
// let query = {restaurant_id:id}



app.get('/movietype/:format',async(req,res) => {
    let movietype = (req.params.format);
    let query = {movie_Format:movietype};
    let collection = "Movies";
    let output = await getData(collection,query);
    res.send(output)
})

// //orders
app.get('/orders',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})


//placeOrder
app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log("Data is",data)
    let response = await postData(collection,data)
    res.send(response)
})

//menu details {"id":[4,8,21]}
app.post('/moviedetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {movie_id:{$in:req.body.id}};
        let collection = 'Movies';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please Pass data in form of array')
    }
})

//update
app.put('/updateOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

//delete order
app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})


app.listen(port,function(req,res){
    dbConnect()
    console.log(`Server is running at the moment @ ${port}`)
});