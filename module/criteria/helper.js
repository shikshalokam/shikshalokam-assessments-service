module.exports = class criteriaHelper {

    static getCriteriaIds(themes) {
        let allCriteriaIds = [];
        themes.forEach(theme => {
            let criteriaIdArray = [];
            if (theme.children) {
                criteriaIdArray = this.getCriteriaIds(theme.children);
            } else {
                criteriaIdArray = theme.criteria;
            }
            criteriaIdArray.forEach(eachCriteria => {
                if (eachCriteria.criteriaId) {
                    allCriteriaIds.push(eachCriteria.criteriaId);
                } else {
                    allCriteriaIds.push(eachCriteria);
                }
            })
        })
        return allCriteriaIds;
    }


}