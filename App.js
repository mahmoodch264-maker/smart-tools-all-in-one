import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Linking,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { CameraView, useCameraPermissions } from 'expo-camera';


const tools = [
  { icon: '🧮', name: 'Calculator' },
  { icon: '📏', name: 'Unit Converter' },
  { icon: '⛽', name: 'Fuel & Mileage' },
  { icon: '🖼️', name: 'Image Compressor' },
  { icon: '📄', name: 'Image to PDF' },
  { icon: '📷', name: 'QR Scanner' },
  { icon: '🤖', name: 'AI Tools' },
  { icon: '🌐', name: 'Translator' },
  { icon: '📝', name: 'Notes' },
];


function Header({ title, onBack }) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}


function ToolPage({ title, onBack, children }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}


/* CALCULATOR */

function Calculator({ onBack }) {
  const [display, setDisplay] = useState('0');
  const [first, setFirst] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const number = (n) => {
    if (display === 'Error' || waiting) {
      setDisplay(String(n));
      setWaiting(false);
    } else {
      setDisplay(display === '0' ? String(n) : display + n);
    }
  };

  const decimal = () => {
    if (waiting) {
      setDisplay('0.');
      setWaiting(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirst(null);
    setOperator(null);
    setWaiting(false);
  };

  const calculate = () => {
    if (first === null || operator === null) return;

    const second = parseFloat(display);
    let result = 0;

    if (operator === '+') result = first + second;
    if (operator === '-') result = first - second;
    if (operator === '×') result = first * second;

    if (operator === '÷') {
      if (second === 0) {
        setDisplay('Error');
        setFirst(null);
        setOperator(null);
        return;
      }
      result = first / second;
    }

    setDisplay(String(result));
    setFirst(null);
    setOperator(null);
    setWaiting(true);
  };

  const operation = (op) => {
    setFirst(parseFloat(display));
    setOperator(op);
    setWaiting(true);
  };

  const button = (text, action) => (
    <TouchableOpacity
      onPress={action}
      style={styles.calcButton}
    >
      <Text style={styles.calcButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ToolPage title="Calculator" onBack={onBack}>
      <View style={styles.calculator}>

        <View style={styles.displayBox}>
          <Text style={styles.displayText}>{display}</Text>
        </View>

        <View style={styles.calcRow}>
          {button('C', clear)}
          {button('÷', () => operation('÷'))}
          {button('×', () => operation('×'))}
          {button('-', () => operation('-'))}
        </View>

        <View style={styles.calcRow}>
          {button('7', () => number(7))}
          {button('8', () => number(8))}
          {button('9', () => number(9))}
          {button('+', () => operation('+'))}
        </View>

        <View style={styles.calcRow}>
          {button('4', () => number(4))}
          {button('5', () => number(5))}
          {button('6', () => number(6))}
          {button('=', calculate)}
        </View>

        <View style={styles.calcRow}>
          {button('1', () => number(1))}
          {button('2', () => number(2))}
          {button('3', () => number(3))}
          {button('0', () => number(0))}
        </View>

        <View style={styles.calcRow}>
          {button('.', decimal)}
        </View>

      </View>
    </ToolPage>
  );
}


/* UNIT CONVERTER */

function UnitConverter({ onBack }) {
  const [value, setValue] = useState('');
  const [type, setType] = useState('km');

  const convert = () => {
    const n = parseFloat(value);

    if (isNaN(n)) return 'Enter a number';

    if (type === 'km') return `${n} km = ${(n * 0.621371).toFixed(3)} miles`;
    if (type === 'miles') return `${n} miles = ${(n * 1.60934).toFixed(3)} km`;
    if (type === 'kg') return `${n} kg = ${(n * 2.20462).toFixed(3)} lb`;
    if (type === 'lb') return `${n} lb = ${(n * 0.453592).toFixed(3)} kg`;
    if (type === 'c') return `${n} °C = ${((n * 9) / 5 + 32).toFixed(2)} °F`;

    return `${n} °F = ${(((n - 32) * 5) / 9).toFixed(2)} °C`;
  };

  return (
    <ToolPage title="Unit Converter" onBack={onBack}>

      <Text style={styles.pageTitle}>Unit Converter</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter value"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <View style={styles.optionGrid}>

        {[
          ['km', 'KM → Miles'],
          ['miles', 'Miles → KM'],
          ['kg', 'KG → LB'],
          ['lb', 'LB → KG'],
          ['c', '°C → °F'],
          ['f', '°F → °C'],
        ].map(([key, label]) => (

          <TouchableOpacity
            key={key}
            onPress={() => setType(key)}
            style={[
              styles.optionButton,
              type === key && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                type === key && styles.optionTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>

        ))}

      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultText}>{convert()}</Text>
      </View>

    </ToolPage>
  );
}


/* FUEL */

function FuelMileage({ onBack }) {
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [price, setPrice] = useState('');

  const calculate = () => {
    const d = parseFloat(distance);
    const f = parseFloat(fuel);
    const p = parseFloat(price);

    if (!d || !f) {
      Alert.alert(
        'Enter Details',
        'Please enter distance and fuel used.'
      );
      return;
    }

    const mileage = d / f;
    const cost = p ? f * p : 0;

    Alert.alert(
      'Fuel Result',
      `Mileage: ${mileage.toFixed(2)} km/L\n` +
      `Fuel used: ${f.toFixed(2)} L\n` +
      `Estimated cost: ${cost.toFixed(2)}`
    );
  };

  return (
    <ToolPage title="Fuel & Mileage" onBack={onBack}>

      <Text style={styles.pageTitle}>Fuel & Mileage</Text>

      <TextInput
        style={styles.input}
        placeholder="Distance (km)"
        keyboardType="numeric"
        value={distance}
        onChangeText={setDistance}
      />

      <TextInput
        style={styles.input}
        placeholder="Fuel used (litres)"
        keyboardType="numeric"
        value={fuel}
        onChangeText={setFuel}
      />

      <TextInput
        style={styles.input}
        placeholder="Fuel price per litre"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={calculate}
      >
        <Text style={styles.primaryButtonText}>
          Calculate
        </Text>
      </TouchableOpacity>

    </ToolPage>
  );
}


/* IMAGE COMPRESSOR */

function ImageCompressor({ onBack }) {
  const [image, setImage] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [quality, setQuality] = useState(0.6);
  const [loading, setLoading] = useState(false);

  const chooseImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow photo library access.'
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0]);
      setCompressed(null);
    }
  };

  const compressImage = async () => {
    if (!image) {
      Alert.alert(
        'Choose Image',
        'Please choose an image first.'
      );
      return;
    }

    try {
      setLoading(true);

      let actions = [];

      if (image.width && image.width > 1200) {
        actions.push({
          resize: { width: 1200 },
        });
      }

      const result =
        await ImageManipulator.manipulateAsync(
          image.uri,
          actions,
          {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

      setCompressed(result);

      Alert.alert(
        'Success',
        'Compression completed successfully.'
      );

    } catch (error) {
      Alert.alert(
        'Compression Error',
        'Could not compress the image.'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveToGallery = async () => {
    if (!compressed) return;

    try {
      const permission =
        await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo access.'
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(
        compressed.uri
      );

      Alert.alert(
        'Saved',
        'Compressed image saved to your Gallery.'
      );

    } catch (error) {
      Alert.alert(
        'Save Error',
        'Could not save the image.'
      );
    }
  };

  return (
    <ToolPage
      title="Image Compressor"
      onBack={onBack}
    >

      <Text style={styles.bigEmoji}>🖼️</Text>

      <Text style={styles.pageTitle}>
        Image Compressor
      </Text>

      <Text style={styles.subtitle}>
        Reduce image size while keeping good quality.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={chooseImage}
      >
        <Text style={styles.primaryButtonText}>
          📷 Choose Image
        </Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.imageCard}>

          <Text style={styles.cardTitle}>
            Original Image
          </Text>

          <Image
            source={{ uri: image.uri }}
            style={styles.previewImage}
            resizeMode="contain"
          />

          <Text style={styles.imageInfo}>
            {image.width || '?'} × {image.height || '?'} px
          </Text>

        </View>
      )}

      {image && (
        <View style={styles.imageCard}>

          <Text style={styles.cardTitle}>
            Compression Quality
          </Text>

          <View style={styles.qualityRow}>

            {[
              [0.3, 'Small Size'],
              [0.6, 'Balanced'],
              [0.8, 'High Quality'],
            ].map(([q, label]) => (

              <TouchableOpacity
                key={label}
                style={[
                  styles.qualityButton,
                  quality === q &&
                    styles.qualitySelected,
                ]}
                onPress={() => setQuality(q)}
              >
                <Text
                  style={[
                    styles.qualityText,
                    quality === q &&
                      styles.qualityTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>

            ))}

          </View>

        </View>
      )}

      {image && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={compressImage}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading
              ? 'Compressing...'
              : '🗜️ Compress Image'}
          </Text>
        </TouchableOpacity>
      )}

      {compressed && (
        <>

          <View style={styles.imageCard}>

            <Text style={styles.cardTitle}>
              Compressed Image
            </Text>

            <Image
              source={{ uri: compressed.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />

          </View>

          <Text style={styles.successText}>
            ✅ Compression completed successfully
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveToGallery}
          >
            <Text style={styles.primaryButtonText}>
              💾 Save to Gallery
            </Text>
          </TouchableOpacity>

        </>
      )}

    </ToolPage>
  );
}


/* IMAGE TO PDF */

function ImageToPDF({ onBack }) {
  const [image, setImage] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const chooseImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow photo library access.'
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0]);
      setPdfUri(null);
    }
  };

  const createPDF = async () => {

    if (!image) {
      Alert.alert(
        'Choose Image',
        'Please choose an image first.'
      );
      return;
    }

    try {

      setLoading(true);

      const html = `
        <html>
          <body
            style="margin:20px;text-align:center;"
          >
            <h2>Smart Tools - Image to PDF</h2>

            <img
              src="${image.uri}"
              style="width:100%;height:auto;"
            />
          </body>
        </html>
      `;

      const result =
        await Print.printToFileAsync({
          html,
          base64: false,
        });

      setPdfUri(result.uri);

      Alert.alert(
        'PDF Created',
        'Your PDF has been created successfully.'
      );

    } catch (error) {

      Alert.alert(
        'PDF Error',
        'Could not create the PDF.'
      );

    } finally {
      setLoading(false);
    }
  };

  const sharePDF = async () => {

    if (!pdfUri) return;

    try {

      const available =
        await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert(
          'Unavailable',
          'PDF sharing is not available.'
        );
        return;
      }

      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PDF',
        UTI: 'com.adobe.pdf',
      });

    } catch (error) {

      Alert.alert(
        'Share Error',
        'Could not share the PDF.'
      );
    }
  };

  return (
    <ToolPage
      title="Image to PDF"
      onBack={onBack}
    >

      <Text style={styles.bigEmoji}>📄</Text>

      <Text style={styles.pageTitle}>
        Image to PDF
      </Text>

      <Text style={styles.subtitle}>
        Convert your image into a PDF document.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={chooseImage}
      >
        <Text style={styles.primaryButtonText}>
          🖼️ Choose Image
        </Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.imageCard}>

          <Text style={styles.cardTitle}>
            Selected Image
          </Text>

          <Image
            source={{ uri: image.uri }}
            style={styles.previewImage}
            resizeMode="contain"
          />

        </View>
      )}

      {image && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={createPDF}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading
              ? 'Creating PDF...'
              : '📄 Create PDF'}
          </Text>
        </TouchableOpacity>
      )}

      {pdfUri && (
        <>

          <Text style={styles.successText}>
            ✅ PDF created successfully
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={sharePDF}
          >
            <Text style={styles.primaryButtonText}>
              📤 Share / Save PDF
            </Text>
          </TouchableOpacity>

        </>
      )}

    </ToolPage>
  );
}


/* QR SCANNER */

function QRScanner({ onBack }) {

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] =
    useState(false);

  const [result, setResult] =
    useState('');

  if (!permission) {
    return (
      <ToolPage
        title="QR Scanner"
        onBack={onBack}
      >
        <Text style={styles.pageTitle}>
          Loading Camera...
        </Text>
      </ToolPage>
    );
  }

  if (!permission.granted) {
    return (
      <ToolPage
        title="QR Scanner"
        onBack={onBack}
      >

        <Text style={styles.bigEmoji}>
          📷
        </Text>

        <Text style={styles.pageTitle}>
          QR Scanner
        </Text>

        <Text style={styles.subtitle}>
          Camera permission is required to scan QR codes.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.primaryButtonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>

      </ToolPage>
    );
  }

  const handleBarcodeScanned = ({ data }) => {

    if (scanned) return;

    setScanned(true);
    setResult(data);
  };

  const openResult = async () => {

    try {

      if (
        result.startsWith('http://') ||
        result.startsWith('https://')
      ) {
        await Linking.openURL(result);
      } else {
        Alert.alert('QR Result', result);
      }

    } catch (error) {

      Alert.alert(
        'Error',
        'Could not open this result.'
      );
    }
  };

  const scanAgain = () => {
    setScanned(false);
    setResult('');
  };

  return (
    <SafeAreaView style={styles.cameraPage}>

      <Header
        title="QR Scanner"
        onBack={onBack}
      />

      <View style={styles.cameraContainer}>

        {!scanned ? (

          <>

            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={
                handleBarcodeScanned
              }
            />

            <View style={styles.scanFrame}>

              <View
                style={styles.cornerTopLeft}
              />

              <View
                style={styles.cornerTopRight}
              />

              <View
                style={styles.cornerBottomLeft}
              />

              <View
                style={styles.cornerBottomRight}
              />

            </View>

            <View style={styles.scanMessage}>

              <Text
                style={styles.scanMessageText}
              >
                Point your camera at a QR code
              </Text>

            </View>

          </>

        ) : (

          <View style={styles.qrResult}>

            <Text style={styles.qrIcon}>
              ✅
            </Text>

            <Text style={styles.qrTitle}>
              QR Code Detected
            </Text>

            <View style={styles.qrDataBox}>

              <Text style={styles.qrData}>
                {result}
              </Text>

            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={openResult}
            >
              <Text style={styles.primaryButtonText}>
                🔗 Open Result
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={scanAgain}
            >
              <Text style={styles.secondaryButtonText}>
                📷 Scan Again
              </Text>
            </TouchableOpacity>

          </View>

        )}

      </View>

    </SafeAreaView>
  );
}


/* AI TOOLS */

function AITools({ onBack }) {

  const [mode, setMode] = useState('Rewrite');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const processText = () => {

    const input = text.trim();

    if (!input) {
      Alert.alert(
        'Enter Text',
        'Please enter some text first.'
      );
      return;
    }

    if (mode === 'Rewrite') {
      setResult(
        `Improved Text:\n\n${input}\n\n` +
        `Tip: Keep your message clear, polite and professional.`
      );
    }

    if (mode === 'Summarize') {

      const sentences =
        input
          .split(/[.!?]+/)
          .map(x => x.trim())
          .filter(Boolean);

      const summary =
        sentences.length > 2
          ? sentences.slice(0, 2).join('. ') + '.'
          : input;

      setResult(
        `Summary:\n\n${summary}`
      );
    }

    if (mode === 'Ideas') {

      setResult(
        `💡 Ideas based on your text:\n\n` +
        `1. Create a short and simple version.\n\n` +
        `2. Add important details and examples.\n\n` +
        `3. Make the message more professional.\n\n` +
        `4. Add a strong opening sentence.\n\n` +
        `5. Finish with a clear conclusion.`
      );
    }

    if (mode === 'Chat') {

      const lower = input.toLowerCase();

      if (
        lower.includes('hello') ||
        lower.includes('hi') ||
        lower.includes('salam')
      ) {
        setResult(
          `AI Assistant:\n\nHello! 👋 How can I help you today?`
        );
      } else {
        setResult(
          `AI Assistant:\n\nThanks for your message.\n\n` +
          `You wrote:\n${input}\n\n` +
          `Try Rewrite, Summarize or Ideas for more options.`
        );
      }
    }
  };

  return (
    <ToolPage
      title="AI Tools"
      onBack={onBack}
    >

      <Text style={styles.bigEmoji}>
        🤖
      </Text>

      <Text style={styles.pageTitle}>
        AI Tools
      </Text>

      <Text style={styles.subtitle}>
        Rewrite, summarize, generate ideas and chat.
      </Text>

      <View style={styles.aiModeGrid}>

        {[
          ['Rewrite', '✍️'],
          ['Summarize', '📝'],
          ['Ideas', '💡'],
          ['Chat', '💬'],
        ].map(([item, icon]) => (

          <TouchableOpacity
            key={item}
            onPress={() => {
              setMode(item);
              setResult('');
            }}
            style={[
              styles.aiModeButton,
              mode === item &&
                styles.aiModeSelected,
            ]}
          >

            <Text style={styles.aiModeIcon}>
              {icon}
            </Text>

            <Text
              style={[
                styles.aiModeText,
                mode === item &&
                  styles.aiModeTextSelected,
              ]}
            >
              {item}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

      <View style={styles.aiInputCard}>

        <Text style={styles.aiInputLabel}>
          {mode === 'Chat'
            ? 'Ask AI anything'
            : `Enter text for ${mode}`}
        </Text>

        <TextInput
          style={styles.aiInput}
          placeholder={
            mode === 'Chat'
              ? 'Type your question...'
              : 'Write or paste your text here...'
          }
          multiline
          value={text}
          onChangeText={setText}
        />

        <Text style={styles.aiCharacterCount}>
          {text.length} characters
        </Text>

      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={processText}
      >
        <Text style={styles.primaryButtonText}>
          ✨ {mode}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setText('');
          setResult('');
        }}
      >
        <Text style={styles.secondaryButtonText}>
          🗑️ Clear
        </Text>
      </TouchableOpacity>

      {result !== '' && (

        <View style={styles.aiResultCard}>

          <Text style={styles.cardTitle}>
            AI Result
          </Text>

          <Text style={styles.aiResultText}>
            {result}
          </Text>

        </View>

      )}

    </ToolPage>
  );
}


/* TRANSLATOR */

function Translator({ onBack }) {

  const languages = [
    ['English', 'en'],
    ['Urdu', 'ur'],
    ['Hindi', 'hi'],
    ['Arabic', 'ar'],
    ['French', 'fr'],
    ['Spanish', 'es'],
  ];

  const [from, setFrom] = useState('en');
  const [to, setTo] = useState('ur');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const translate = async () => {

    const input = text.trim();

    if (!input) {
      Alert.alert(
        'Enter Text',
        'Please enter text to translate.'
      );
      return;
    }

    if (from === to) {
      setResult(input);
      return;
    }

    try {

      setLoading(true);
      setResult('');

      const url =
        `https://api.mymemory.translated.net/get?` +
        `q=${encodeURIComponent(input)}` +
        `&langpair=${from}|${to}`;

      const response = await fetch(url);

      const data = await response.json();

      if (
        data &&
        data.responseData &&
        data.responseData.translatedText
      ) {

        setResult(
          data.responseData.translatedText
        );

      } else {

        Alert.alert(
          'Translation Error',
          'Could not translate this text.'
        );
      }

    } catch (error) {

      Alert.alert(
        'Connection Error',
        'Please check your internet connection and try again.'
      );

    } finally {
      setLoading(false);
    }
  };


  const swapLanguages = () => {

    const oldFrom = from;

    setFrom(to);
    setTo(oldFrom);

    if (result) {
      setText(result);
      setResult('');
    }
  };


  return (
    <ToolPage
      title="Translator"
      onBack={onBack}
    >

      <Text style={styles.bigEmoji}>
        🌐
      </Text>

      <Text style={styles.pageTitle}>
        Translator
      </Text>

      <Text style={styles.subtitle}>
        Translate text between multiple languages.
      </Text>


      {/* LANGUAGE SELECTORS */}

      <View style={styles.languageCard}>

        <View style={styles.languageBox}>

          <Text style={styles.languageLabel}>
            From
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >

            {languages.map(([name, code]) => (

              <TouchableOpacity
                key={code}
                onPress={() => setFrom(code)}
                style={[
                  styles.languageButton,
                  from === code &&
                    styles.languageSelected,
                ]}
              >

                <Text
                  style={[
                    styles.languageButtonText,
                    from === code &&
                      styles.languageTextSelected,
                  ]}
                >
                  {name}
                </Text>

              </TouchableOpacity>

            ))}

          </ScrollView>

        </View>


        <TouchableOpacity
          style={styles.swapButton}
          onPress={swapLanguages}
        >
          <Text style={styles.swapText}>
            ⇄
          </Text>
        </TouchableOpacity>


        <View style={styles.languageBox}>

          <Text style={styles.languageLabel}>
            To
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >

            {languages.map(([name, code]) => (

              <TouchableOpacity
                key={code}
                onPress={() => setTo(code)}
                style={[
                  styles.languageButton,
                  to === code &&
                    styles.languageSelected,
                ]}
              >

                <Text
                  style={[
                    styles.languageButtonText,
                    to === code &&
                      styles.languageTextSelected,
                  ]}
                >
                  {name}
                </Text>

              </TouchableOpacity>

            ))}

          </ScrollView>

        </View>

      </View>


      {/* INPUT */}

      <View style={styles.translateCard}>

        <Text style={styles.translateLabel}>
          Enter text
        </Text>

        <TextInput
          style={styles.translateInput}
          placeholder="Type or paste text here..."
          multiline
          value={text}
          onChangeText={setText}
        />

        <Text style={styles.translateCount}>
          {text.length} characters
        </Text>

      </View>


      <TouchableOpacity
        style={styles.primaryButton}
        onPress={translate}
        disabled={loading}
      >

        <Text style={styles.primaryButtonText}>
          {loading
            ? '🌐 Translating...'
            : '🌐 Translate'}
        </Text>

      </TouchableOpacity>


      {/* RESULT */}

      {result !== '' && (

        <View style={styles.translateResultCard}>

          <Text style={styles.cardTitle}>
            Translation
          </Text>

          <Text style={styles.translateResult}>
            {result}
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setText(result)}
          >

            <Text style={styles.secondaryButtonText}>
              📋 Use Translation
            </Text>

          </TouchableOpacity>

        </View>

      )}

    </ToolPage>
  );
}


/* NOTES */

function Notes({ onBack }) {

  const [note, setNote] = useState('');

  return (
    <ToolPage
      title="Notes"
      onBack={onBack}
    >

      <Text style={styles.pageTitle}>
        Quick Notes
      </Text>

      <TextInput
        style={styles.notesInput}
        placeholder="Write your note here..."
        multiline
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.noteCount}>
        {note.length} characters
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          Alert.alert(
            'Note',
            note || 'Your note is empty.'
          )
        }
      >

        <Text style={styles.primaryButtonText}>
          Save Note
        </Text>

      </TouchableOpacity>

    </ToolPage>
  );
}


/* HOME */

function Home({ openTool }) {

  const [search, setSearch] =
    useState('');

  const filteredTools =
    tools.filter(tool =>
      tool.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.homeHeader}>

        <View>

          <Text style={styles.appTitle}>
            Smart Tools
          </Text>

          <Text style={styles.appSubtitle}>
            All in One
          </Text>

        </View>

        <Text style={styles.crown}>
          👑
        </Text>

      </View>


      <ScrollView
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >

        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Search tools..."
          value={search}
          onChangeText={setSearch}
        />


        <View style={styles.toolGrid}>

          {filteredTools.map(tool => (

            <TouchableOpacity
              key={tool.name}
              style={[
                styles.toolCard,
                tool.name === 'Translator' &&
                  styles.aiHomeCard,
              ]}
              onPress={() =>
                openTool(tool.name)
              }
            >

              <Text style={styles.toolIcon}>
                {tool.icon}
              </Text>

              <Text style={styles.toolName}>
                {tool.name}
              </Text>

            </TouchableOpacity>

          ))}

        </View>


        <TouchableOpacity
          style={styles.premiumCard}
          onPress={() =>
            Alert.alert(
              'Go Premium',
              'Premium features will be available soon.'
            )
          }
        >

          <View>

            <Text style={styles.premiumTitle}>
              👑 Go Premium
            </Text>

            <Text style={styles.premiumSubtitle}>
              Remove ads & unlock more tools
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        <Text style={styles.footer}>
          Smart Tools All in One
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}


/* APP */

export default function App() {

  const [screen, setScreen] =
    useState('Home');

  const openTool = name => {
    setScreen(name);
  };


  if (screen === 'Home') {
    return <Home openTool={openTool} />;
  }

  if (screen === 'Calculator') {
    return (
      <Calculator
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Unit Converter') {
    return (
      <UnitConverter
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Fuel & Mileage') {
    return (
      <FuelMileage
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Image Compressor') {
    return (
      <ImageCompressor
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Image to PDF') {
    return (
      <ImageToPDF
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'QR Scanner') {
    return (
      <QRScanner
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'AI Tools') {
    return (
      <AITools
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Translator') {
    return (
      <Translator
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Notes') {
    return (
      <Notes
        onBack={() => setScreen('Home')}
      />
    );
  }

  return <Home openTool={openTool} />;
}


/* STYLES */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  homeHeader: {
    backgroundColor: '#1688F5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  appTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
  },

  appSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 2,
  },

  crown: {
    fontSize: 28,
  },

  homeContent: {
    padding: 14,
    paddingBottom: 30,
  },

  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 46,
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E6ED',
  },

  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  toolCard: {
    width: '31.5%',
    backgroundColor: 'white',
    borderRadius: 13,
    paddingVertical: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7EAF0',
    elevation: 2,
  },

  aiHomeCard: {
    borderColor: '#1688F5',
    borderWidth: 2,
  },

  toolIcon: {
    fontSize: 26,
    marginBottom: 8,
  },

  toolName: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },

  premiumCard: {
    backgroundColor: '#FFE36E',
    borderRadius: 13,
    padding: 15,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  premiumTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  premiumSubtitle: {
    fontSize: 10,
    marginTop: 3,
    color: '#555',
  },

  arrow: {
    fontSize: 27,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 10,
    marginTop: 20,
  },

  headerBar: {
    backgroundColor: '#1688F5',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: 'white',
    fontSize: 38,
    lineHeight: 40,
  },

  headerTitle: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
  },

  pageContent: {
    padding: 18,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 8,
    color: '#171717',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    fontSize: 13,
    marginBottom: 20,
  },

  bigEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
    fontSize: 15,
  },

  primaryButton: {
    backgroundColor: '#1688F5',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },

  primaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
  },

  secondaryButton: {
    backgroundColor: '#E9EEF5',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },

  secondaryButtonText: {
    color: '#1688F5',
    fontSize: 15,
    fontWeight: '800',
  },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  optionButton: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
    alignItems: 'center',
  },

  optionSelected: {
    backgroundColor: '#1688F5',
    borderColor: '#1688F5',
  },

  optionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222',
  },

  optionTextSelected: {
    color: 'white',
  },

  resultCard: {
    backgroundColor: 'white',
    borderRadius: 13,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },

  resultText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  calculator: {
    backgroundColor: '#171717',
    borderRadius: 18,
    padding: 15,
  },

  displayBox: {
    backgroundColor: '#292929',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  displayText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
  },

  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  calcButton: {
    backgroundColor: '#3A3A3A',
    width: '23%',
    minHeight: 58,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  calcButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },

  imageCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E3E7EC',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#F0F2F5',
  },

  imageInfo: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },

  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  qualityButton: {
    width: '31.5%',
    backgroundColor: '#EDF0F5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  qualitySelected: {
    backgroundColor: '#1688F5',
  },

  qualityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#222',
  },

  qualityTextSelected: {
    color: 'white',
  },

  successText: {
    textAlign: 'center',
    color: '#16884A',
    fontWeight: '700',
    marginVertical: 8,
  },

  saveButton: {
    backgroundColor: '#16884A',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  notesInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    minHeight: 220,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 15,
  },

  noteCount: {
    textAlign: 'right',
    color: '#999',
    marginTop: 6,
  },


  /* AI */

  aiModeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  aiModeButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E5EA',
  },

  aiModeSelected: {
    backgroundColor: '#1688F5',
    borderColor: '#1688F5',
  },

  aiModeIcon: {
    fontSize: 25,
    marginBottom: 5,
  },

  aiModeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#222',
  },

  aiModeTextSelected: {
    color: 'white',
  },

  aiInputCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3E7EC',
    marginTop: 4,
  },

  aiInputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },

  aiInput: {
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    minHeight: 170,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#222',
  },

  aiCharacterCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 11,
    marginTop: 6,
  },

  aiResultCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E3E7EC',
  },

  aiResultText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#333',
    marginTop: 5,
  },


  /* TRANSLATOR */

  languageCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3E7EC',
    marginBottom: 12,
  },

  languageBox: {
    marginBottom: 8,
  },

  languageLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    color: '#333',
  },

  languageButton: {
    backgroundColor: '#EDF0F5',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 8,
  },

  languageSelected: {
    backgroundColor: '#1688F5',
  },

  languageButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },

  languageTextSelected: {
    color: 'white',
  },

  swapButton: {
    width: 48,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1688F5',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },

  swapText: {
    color: 'white',
    fontSize: 27,
    fontWeight: '800',
  },

  translateCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3E7EC',
  },

  translateLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },

  translateInput: {
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 12,
    minHeight: 170,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 15,
  },

  translateCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 11,
    marginTop: 6,
  },

  translateResultCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E3E7EC',
  },

  translateResult: {
    fontSize: 17,
    lineHeight: 26,
    color: '#222',
    marginBottom: 10,
  },


  /* CAMERA */

  cameraPage: {
    flex: 1,
    backgroundColor: '#000',
  },

  cameraContainer: {
    flex: 1,
    position: 'relative',
  },

  camera: {
    flex: 1,
  },

  scanFrame: {
    position: 'absolute',
    width: 240,
    height: 240,
    top: '32%',
    left: '50%',
    marginLeft: -120,
    borderWidth: 2,
    borderColor: 'white',
  },

  cornerTopLeft: {
    position: 'absolute',
    width: 35,
    height: 35,
    top: -2,
    left: -2,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#1688F5',
  },

  cornerTopRight: {
    position: 'absolute',
    width: 35,
    height: 35,
    top: -2,
    right: -2,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: '#1688F5',
  },

  cornerBottomLeft: {
    position: 'absolute',
    width: 35,
    height: 35,
    bottom: -2,
    left: -2,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#1688F5',
  },

  cornerBottomRight: {
    position: 'absolute',
    width: 35,
    height: 35,
    bottom: -2,
    right: -2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: '#1688F5',
  },

  scanMessage: {
    position: 'absolute',
    bottom: 45,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 15,
  },

  scanMessageText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },

  qrResult: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 20,
    justifyContent: 'center',
  },

  qrIcon: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 15,
  },

  qrTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },

  qrDataBox: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3E7EC',
    marginBottom: 10,
  },

  qrData: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },

});