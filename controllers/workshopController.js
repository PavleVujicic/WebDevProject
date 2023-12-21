const Workshop = require('../models/workshop');
const User = require('../models/user');
exports.getAddWorkshop = (req, res) => {
  res.render('add-workshop');
};

exports.postAddWorkshop = async (req, res) => {
  try {
    const { title, artist, year, category, medium, description, poster } = req.body;
    const newWorkshop = new Workshop({
      title: req.body.title,
      host: req.session.userId,
      date: req.body.date,
      location: req.body.location,
    });

    await newWorkshop.save();

    const artistUser = await User.findById(req.session.userId);
    //console.log("USER", artistUser.username);
    
    for (const followerId of artistUser.followers) {
      //console.log("IN THE LOOP");
      const follower = await User.findById(followerId);
      if (follower) {
        follower.notifications.push({
          type: 'newWorkshop',
          content: `${artistUser.username} added a new workshop: ${title}.`,
        });
        await follower.save();
      }
    }
    

    res.redirect('/user/account');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.viewWorkshopDetails = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.workshopId);

    if (!workshop) {
      return res.status(404).render('error', { message: 'Workshop not found' });
    }

    res.render('workshopDetails', { workshop });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
};

exports.enrollWorkshop = async (req, res) => {
  try {
    //console.log("IN Workshop");
    const workshop = await Workshop.findById(req.params.workshopId);

    if (!workshop) {
      return res.status(404).render('error', { message: 'Workshop not found' });
    }

    if (!workshop.enrolledUsers) {
      workshop.enrolledUsers = [];
    }
    workshop.enrolledUsers.push(req.session.userId);
    await workshop.save();

    res.render('enrollSuccess', { workshop });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
};

