var WhatCountsNamespace = (function () {
    var WhatCounts = {};

    var createNamespace = function(name){
        var parts = name.split('.');
        var current = WhatCounts;
        for (var index in parts) {
            if (!current[parts[index]]) {
                current[parts[index]] = {};
            }
            current = current[parts[index]];
        }
        return current;
    };

    return {
        createNamespace: createNamespace
    }
})();
