import db from '../models';

const { EventCenter, Event, Facility } = db;

class EventCenterController {
  /**
   * Creates a new center
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json}
   */
  static createCenter(req, res) {
    EventCenter
      .create({
        name: req.body.name,
        description: req.body.description || null,
        type: req.body.type,
        price: req.body.price,
        location: req.body.location,
        userId: req.user.id,
      })
      .then((center) => {
        res.status(201).send({ message: 'center created!', center });
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * Modifies an existing center
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json}
   */
  static modifyCenter(req, res) {
    EventCenter
      .findOne({ where: { id: req.params.centerId } })
      .then((center) => {
        if (center) {
          center
            .update({
              name: req.body.name || center.name,
              description: req.body.description || center.description,
              type: req.body.type || center.type,
              price: req.body.price || center.price,
              location: req.body.location || center.location,
            })
            .then((modifiedCenter) => {
              res.status(200).send({ message: 'center modified!', center: modifiedCenter });
            });
        } else {
          res.status(404).send({ message: 'cannot find specified center!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * Get all centers
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json}
   */
  static getAllCenters(req, res) {
    EventCenter
      .all()
      .then((centers) => {
        if (centers) {
          res.status(200).send({ message: 'all centers delivered!', centers });
        } else {
          res.status(404).send({ message: 'cannot find any center!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * Get a center's details, associated events and facility
   * @param{Object} req - api request
   * @param{Object} res - route response
   * @return{json}
   */
  static getCenter(req, res) {
    EventCenter
      .findById(req.params.centerId, {
        include: [
          { model: Event, as: 'events' },
          { model: Facility, as: 'facility' },
        ],
      })
      .then((center) => {
        if (center) {
          res.status(200).send({ message: 'center delivered!', center });
        } else {
          res.status(404).send({ message: 'cannot find specified center!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }
}

export default EventCenterController;
