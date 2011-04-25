
function goBinarization(th) {
    var loader = new ImageLoader("myCanvas", "image");
    var img = loader.loadImage(1);

    var binarization = new Binarization(img);
    var result = binarization.toBinary(th);

    /* セット */
    loader.saveImage(result);
}

function goAutoBinarization(objTh) {
    var loader = new ImageLoader("myCanvas", "image");
    var img = loader.loadImage(1);

    var binarization = new Binarization(img);
    var th = binarization.getThreshold();
    var result = binarization.toBinary(th);

    objTh.threshold.value = th;

    /* セット */
    loader.saveImage(result);
}
