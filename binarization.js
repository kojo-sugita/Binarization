
/**
 * 2�l��
 */
function Binarization(objTh) {
    var width = 256; // ����256�s�N�Z��
    var height = 256; // �c��256�s�N�Z��
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var imgObj = new Image(width, height);
    imgObj.src = "http://jstap.web.fc2.com/test/html5/binarization/lena.png";
    context.drawImage(imgObj, 0, 0);

    /* �O���[�X�P�[���ɕϊ����� */
    var grayImage = ToGrayscale(canvas, height, width);
    var th = objTh.threshold.value * 1;

    /* 2�l�����s�� */
    var binaryImage = ToBinary(grayImage, height, width, th);

    /* �Z�b�g */
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var I = binaryImage[y * width + x];
            setPixel(canvas, x, y, I, I, I, 255);
        }
    }
}

/**
 * ���ʕ��͖@
 */
function DiscriminantAnalysisMethod(objTh) {
    var width = 256; // ����256�s�N�Z��
    var height = 256; // �c��256�s�N�Z��
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var imgObj = new Image(width, height);
    imgObj.src = "http://jstap.web.fc2.com/test/html5/binarization/lena.png";
    // imgObj.src = "http://jstap.web.fc2.com/test/html5/binarization/baboon.jpg";
    context.drawImage(imgObj, 0, 0);

    /* �O���[�X�P�[���ɕϊ����� */
    var grayImage = ToGrayscale(canvas, height, width);

    /* ���ʕ��͖@�ɂ�邵�����l�̎擾 */
    var th = GetThreshold(grayImage, height, width);

    /* 2�l�����s�� */
    var binaryImage = ToBinary(grayImage, height, width, th);

    /* �Z�b�g */
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var I = binaryImage[y * width + x];
            setPixel(canvas, x, y, I, I, I, 255);
        }
    }
    objTh.threshold.value = th;
}

/**
 * ���ʕ��͖@��p���Ă������l���擾����
 */
function GetThreshold(image, height, width) {
    var devZeroGuard = 0.00000001; // �[�����Z�h�~�p
    var best_t = 0;
    var max = 0;

    for (var t = 1; t < 255; t++) {
        var sum1 = 0, sum2 = 0; // �a
        var sqsum1 = 0, sqsum2 = 0; // �����a
        var n1 = 0, n2 = 0; // �N���X���v�f��
        var n = height * width;

        for(var y = 0; y < height; y++){
            for(var x = 0; x < width; x++){
                if ( image[y * width + x] < t ) {
                    sum1 += image[y * width + x];
                    sqsum1 += image[y * width + x]^2;
                    n1++;

                } else {
                    sum2 += image[y * width + x];
                    sqsum2 += image[y * width + x]^2;
                    n2++;

                }
            }
        }

        /* ���� */
        var m1 = sum1 / (n1 + devZeroGuard);
        var m2 = sum2 / (n2 + devZeroGuard);

        /* ���U */
        var var1 = sqsum1 / (n1 + devZeroGuard) - m1^2;
        var var2 = sqsum2 / (n2 + devZeroGuard) - m2^2;

        /* �N���X�ԕ��U�����߂� */
        var Sb = (n1 * n2 * (m1 - m2)^2) / n^2;

        /* �N���X�����U */
        var Sw = ((n1 * var1) / n) + ((n2 * var2) / n);

        /* ���ʊ֐� */
        var J = Sb / Sw;
        if ( J > max) {
            max = J;
            best_t = t;
        }

    }
    return best_t;
}

/**
 * RBG���O���[�X�P�[���ɂ��ĕԂ���
 */
function ToGrayscale(canvas, height, width) {
    var grayImage = new Array(width * height);

    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            var pixelData = getPixel(canvas, x, y); // �s�N�Z���l���擾����
            var R = pixelData.R;
            var G = pixelData.G;
            var B = pixelData.B;

            R = Math.floor(R * 0.299);
            G = Math.floor(G * 0.587);
            B = Math.floor(B * 0.114);

            // �O���[�X�P�[����
            grayImage[y * width + x] = R + G + B;
        }
    }

    return grayImage;
}

/**
 * 2�l�����s��
 */
function ToBinary(image, height, width, threshold) {
    var binaryImage = new Array(height * width);

    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            if ( image[y * width + x] >= threshold ) {
                binaryImage[y * width + x] = 255;
            } else {
                binaryImage[y * width + x] = 0;
            }
        }
    }

    return binaryImage;
}

// GetPixel
// �߂�l�̓I�u�W�F�N�g�̃v���p�e�B��R,G,B
function getPixel(srcCanvas, x, y){
    if (window.opera) {
        var gContext = srcCanvas.getContext("opera-2dgame");
        var rgbStr = gContext.getPixel(x, y); // �s�N�Z���l���擾����
        var R = eval("0x"+rgbStr.substring(1,3));
        var G = eval("0x"+rgbStr.substring(3,5));
        var B = eval("0x"+rgbStr.substring(5,7));
        return {R:R, G:G, B:B};
    }

    var imagePixelData = srcCanvas.getContext("2d").getImageData(x, y, 1, 1).data;
    var R = imagePixelData[0];
    var G = imagePixelData[1];
    var B = imagePixelData[2];
    return {R:R, G:G, B:B};
}

// SetPixel
function setPixel(srcCanvas, x, y, R, G, B, A){
    if (window.opera) {
        var gContext = srcCanvas.getContext("opera-2dgame");
        var rgbaColor = "rgba("+R+","+G+","+B+","+A+")";
        gContext.setPixel(x,y, rgbaColor);
        return;
    }
    var context = srcCanvas.getContext("2d");
    var pixelImage = context.createImageData(1, 1);
    pixelImage.data[0] = R;
    pixelImage.data[1] = G;
    pixelImage.data[2] = B;
    pixelImage.data[3] = A;
    context.putImageData(pixelImage, x, y);
}