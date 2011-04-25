
/*
 * コンストラクタ
 * @param[in] grayImage グレースケール画像
 */
function Binarization(grayImage) {
    this.src = grayImage;
}

/*
 * 指定されたしきい値により2値化を行う
 * @param[in] threshold しきい値
 * @return 2値化された画像
 */
Binarization.prototype.toBinary = function(threshold) {
    return grayscaleToBinary(this.src, this.src.height, this.src.width, threshold);
}

/**
 * 判別分析法によるしきい値の取得
 * @return しきい値
 */
Binarization.prototype.getThreshold = function() {
    var image = this.src;
    var height = this.src.height;
    var width = this.src.width;

    var devZeroGuard = 0.00000001; // ゼロ除算防止用
    var best_t = 0;
    var max = 0;
    var n = height * width;

    for (var t = 1; t < 255; t++) {
        var sum1 = 0, sum2 = 0; // 和
        var sqsum1 = 0, sqsum2 = 0; // 平方和
        var n1 = 0, n2 = 0; // クラス内要素数

        for(var y = 0; y < height; y++){
            for(var x = 0; x < width; x++){
                var pixel = image.getPixel(x, y);
                if ( pixel < t ) {
                    sum1 += pixel;
                    sqsum1 += pixel^2;
                    n1++;

                } else {
                    sum2 += pixel;
                    sqsum2 += pixel^2;
                    n2++;

                }
            }
        }

        /* 平均 */
        var m1 = sum1 / (n1 + devZeroGuard);
        var m2 = sum2 / (n2 + devZeroGuard);

        /* 分散 */
        var var1 = sqsum1 / (n1 + devZeroGuard) - m1^2;
        var var2 = sqsum2 / (n2 + devZeroGuard) - m2^2;

        /* クラス間分散を求める */
        var Sb = (n1 * n2 * (m1 - m2)^2) / n^2;

        /* クラス内分散 */
        var Sw = ((n1 * var1) / n) + ((n2 * var2) / n);

        /* 判別関数 */
        var J = Sb / Sw;
        if ( J > max) {
            max = J;
            best_t = t;
        }

    }
    return best_t;
}

/*
 * グレースケール画像を2値化する
 * @param[in] image IplImageオブジェクト
 * @param[in] height 高さ
 * @param[in] width 幅
 * @param[in] threshold しきい値
 */
function grayscaleToBinary(image, height, width, threshold) {
    var result = image.copy();

    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            if ( image.getPixel(x, y) >= threshold ) {
                result.setPixel(x, y, 255);
            } else {
                result.setPixel(x, y, 0);
            }
        }
    }

    return result;
}

