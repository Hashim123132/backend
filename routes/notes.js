const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');



//Route 1:GET ALL the notes using: GET "/api/notes/getuser". Login Required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
 
  try{
    const userId = req.user.id;
   const notes = await Notes.find({userId});
   res.json(notes);
  }catch(error){
    console.log(error.message);
    res.status(500).send('Internal Server Error')

  }
});
  //Route 2 : Add a new Note using POST "/api/notes/addnote"
router.post('/addnotes', fetchuser,[
    body('title', 'title must be at least 3 characters long').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters long').isLength({ min: 5 }),

  ], async (req, res) => {
    
    
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }


    const {title , description , tag} = req.body;
    try{
    const savedNotes = await Notes.create({
      title,
      description,
      tag,
      user : req.user.id
    });
      res.json(savedNotes)
    }catch(error){
      console.log(error.message)
      res.status(500).send('Internal Server Error')
      
    }
   
  
    
})
  

//Route 3 :update an existing note using PUT "/api/notes/updatenotes"
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    
  const {title, description, tag} = req.body
  
  //create a newNote
   
  const newNote = {};
  
  if(title){newNote.title = title}  
  if(description){newNote.description = description}  
  if(tag){newNote.tag = tag}  

 
  
   
  try {
    let notes = await Notes.findById(req.params.id);

    // Check if note exists
    if (!notes) {
      return res.status(404).send('Not Found');
    }

    // Check if the user is authorized to update the note
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    // Update the note
    notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ notes });

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});


//Route 4 :delete an existing note using DELETE "/api/notes/deletenotes"
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    
  const {title, description, tag} = req.body
  


 
  
   //FIND THE NOTE TO BE DELETED
  try {
    let notes = await Notes.findById(req.params.id);

    // Check if note exists
    if (!notes) {
      return res.status(404).send('Not Found');
    }

    // Check if the user is authorized to delete the note
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    // delete the note
    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ 'Success': 'Note has been deleted', notes:notes });

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

