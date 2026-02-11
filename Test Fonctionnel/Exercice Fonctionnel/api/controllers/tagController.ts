import type { Request, Response } from 'express';
import { getRealm } from '../config/realm.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Private
export const getTags = async (req: Request, res: Response) => {
  try {
    const realm = await getRealm();
    const tags = realm.objects('Tag').filtered('userId == $0', req.user?.id);

    const tagsJson = tags.map((tag: any) => ({
      _id: tag._id,
      name: tag.name,
      color: tag.color,
      userId: tag.userId,
    }));

    res.json({ success: true, tags: tagsJson });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a tag
// @route   POST /api/tags
// @access  Private
export const createTag = async (req: Request, res: Response) => {
  const { name, color } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ success: false, error: 'Missing name' });
    }

    if (!color) {
      return res.status(400).json({ success: false, error: 'Missing color' });
    }

    const realm = await getRealm();

    let tag: any;
    realm.write(() => {
      tag = realm.create('Tag', {
        _id: uuidv4(),
        name,
        color,
        userId: req.user?.id,
        createdAt: new Date(),
      });
    });

    res.json({
      success: true,
      tag: {
        _id: tag._id,
        name: tag.name,
        color: tag.color,
        userId: tag.userId,
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Private
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const realm = await getRealm();
    const tag: any = realm.objectForPrimaryKey('Tag', req.params.id);

    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }

    if (tag.userId !== req.user?.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    realm.write(() => {
      realm.delete(tag);
    });

    res.json({ success: true, message: 'Tag removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};