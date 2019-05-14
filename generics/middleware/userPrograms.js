module.exports = async (req, res, next) => {
    if (req.userDetails && req.userDetails.id) {

        let roles = _.pull(req.userDetails.allRoles, 'PUBLIC');
        req.userDetails["userRole"] = gen.utils.mapUserRole(roles[0]);
        let queryParams = roles.map(role => {
            return {
                [`roles.${gen.utils.mapUserRole(role)}.users`]: { $in: [req.userDetails.id] }
            }
        })

        let programs = await database.models.solutions.aggregate([
            { $match: { $or: queryParams } },
            {
                $project: {
                    externalId: "$programExternalId",
                    name: "$programName",
                    description: "$programDescription"
                }
            }
        ]);

        if (programs.length) req['userDetails'].accessiblePrograms = programs

    }
    next();
    return;
}


