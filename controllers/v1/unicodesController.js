/**
 * name : unicodesController.js
 * author : Deepa
 * created-date : 17-Aug-2020
 * Description : unicodes related information.
 */

/**
    * Unicodes
    * @class
*/
module.exports = class Unicodes extends Abstract {

    constructor() {
      super(unicodesSchema);
    }
  
    static get name() {
      return "unicodes";
    }
  
  };
  