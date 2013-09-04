define(['backbone', 'models/user/userModel'], function(Backbone, userModel) {

    var UserCollection = Backbone.Collection.extend({
    	url: function() {
            return Backbone.Model.gateWayUrl + '/getUsers';
        },

        model: userModel
    });

    return UserCollection;
});
