const Poem = require("../Model/Poem");
const User = require("../Model/User");

// Add Poem
const addPoem = async (req, res) => {
  try {
    const { title, stanzas } = req.body;

    // Check if user exists
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate stanzas
    if (!Array.isArray(stanzas) || stanzas.length === 0) {
      return res.status(400).json({ message: "At least one stanza is required" });
    }

    if (stanzas.some(s => !s || !s.trim())) {
      return res.status(400).json({ message: "Stanzas must not be empty" });
    }

    const newPoem = new Poem({
      title: title.trim(),
      stanzas: stanzas.map(s => s.trim()),
      createdBy: req.user.userId,
    });

    await newPoem.save();
    res.status(201).json(newPoem);
  } catch (err) {
    res.status(500).json({ error: "Failed to create poem", message: err.message });
  }
};

// Edit Poem
const editPoem = async (req, res) => {
  const { id } = req.params;
  const { title, stanzas } = req.body;

  try {
    const poem = await Poem.findById(id);
    if (!poem) return res.status(404).json({ message: "Poem not found" });

    if (poem.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Optional: Check title
    if (title && !title.trim()) {
      return res.status(400).json({ message: "Title must not be empty" });
    }

    // Optional: Check stanzas
    if (stanzas) {
      if (!Array.isArray(stanzas) || stanzas.length === 0) {
        return res.status(400).json({ message: "Stanzas must be a non-empty array" });
      }
      if (stanzas.some(s => !s || !s.trim())) {
        return res.status(400).json({ message: "Stanzas must not be empty" });
      }
      poem.stanzas = stanzas.map(s => s.trim());
    }

    if (title) poem.title = title.trim();

    await poem.save();
    res.json(poem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update poem", message: err.message });
  }
};


// Delete Poem
const deletePoem = async (req, res) => {
    const { id } = req.params;
  
    try {
      const poem = await Poem.findById(id);
      if (!poem) return res.status(404).json({ message: "Poem not found" });
      if (poem.createdBy.toString() !== req.user.userId)
        return res.status(403).json({ message: "Unauthorized" });
  
      await Poem.findByIdAndDelete(id);
      res.json({ message: "Poem deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete poem", message: err.message });
    }
  };
  
  // Get Specific Poem
  const getPoem = async (req, res) => {
    const { id } = req.params;
  
    try {
      const poem = await Poem.findById(id).populate("createdBy", "name username");
      if (!poem) return res.status(404).json({ message: "Poem not found" });
  
      res.json(poem);
    } catch (err) {
      res.status(500).json({ message: "Failed to get poem", error: err.message });
    }
  };
  const getAllPoem = async (req, res) => {
  
    try {
      const user = await User.findById(req.user.userId)
      if(!user)  throw new Error('User Not Found')
      const poem = await Poem.find({createdBy:req.user.userId})
      if (!poem) return res.status(404).json({ message: "Poem not found" });
  
      return res.json(poem);
    } catch (err) {
      res.status(500).json({ error: "Failed to get poem", message: err.message });
    }
  };

  const createBook = async(req,res)=>{
    try {
      const {username} = req.params
      const user = await User.findOne({username:username})
      if(!user) throw new Error("No User Found")
      const poems = await Poem.find({createdBy:user._id})

      return res.status(200).json({user:user,poems})
      
    } catch (err) {
      res.status(500).json({ error: "Failed to get poem", message: err.message });
    }
  }
  
  module.exports = {
    addPoem,
    editPoem,
    deletePoem,
    getPoem,
    getAllPoem,
    createBook
  };
