const mongoose = require("mongoose");
const Note = require("../models/Note");

/**
 * Validate note ID, fetch the note, and verify the logged-in user owns it.
 * Returns either { note } or { error: { status, message } }.
 */
const findOwnedNote = async (noteId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return { error: { status: 400, message: "Invalid note ID format." } };
  }

  const note = await Note.findById(noteId);
  if (!note) {
    return { error: { status: 404, message: "Note not found." } };
  }

  if (note.user.toString() !== userId.toString()) {
    return {
      error: {
        status: 403,
        message: "Access denied. You can only access your own notes.",
      },
    };
  }

  return { note };
};

/**
 * @desc    Create a new note for the logged-in user
 * @route   POST /api/notes
 * @access  Private
 */
const createNote = async (req, res) => {
  const { title, content } = req.body || {};

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    return res.status(400).json({
      message: "Both title and content are required.",
    });
  }

  const note = await Note.create({
    title: title.trim(),
    content: content.trim(),
    user: req.user._id,
  });

  res.status(201).json({
    message: "Note created successfully.",
    note,
  });
};

/**
 * @desc    Get all notes belonging to the logged-in user
 * @route   GET /api/notes
 * @access  Private
 */
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });

  res.status(200).json({
    count: notes.length,
    notes,
  });
};

/**
 * @desc    Get a specific note by ID (must belong to logged-in user)
 * @route   GET /api/notes/:id
 * @access  Private
 */
const getNoteById = async (req, res) => {
  const { note, error } = await findOwnedNote(req.params.id, req.user._id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  res.status(200).json({ note });
};

/**
 * @desc    Update an existing note (must belong to logged-in user)
 * @route   PUT /api/notes/:id
 * @access  Private
 */
const updateNote = async (req, res) => {
  const { note, error } = await findOwnedNote(req.params.id, req.user._id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const { title, content } = req.body || {};

  if (title === undefined && content === undefined) {
    return res.status(400).json({
      message: "Provide at least title or content to update.",
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title must be a non-empty string." });
    }
    note.title = title.trim();
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Content must be a non-empty string." });
    }
    note.content = content.trim();
  }

  await note.save();

  res.status(200).json({
    message: "Note updated successfully.",
    note,
  });
};

/**
 * @desc    Delete a note (must belong to logged-in user)
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res) => {
  const { note, error } = await findOwnedNote(req.params.id, req.user._id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  await note.deleteOne();

  res.status(200).json({
    message: "Note deleted successfully.",
  });
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};

