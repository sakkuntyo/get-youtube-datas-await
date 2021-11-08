'use strict;'

import getYoutube from "./index.js"


(async () => {
    const datas = await getYoutube("jpop 2020")
    console.dir(datas);
})();
