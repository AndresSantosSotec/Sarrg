# Sarrg


Project Id Expo
Pablo
f3b0853a-325f-4ecc-8794-c1af1dd60e2a
Owner Previo
andresdev2905

Project Id  Expo
2644c7b8-c85a-4761-b183-9bf9e89e2ae8

eas login

Para remplazar el AppId y el Owner cuando ya existe un registro previo.
eas init --id 2644c7b8-c85a-4761-b183-9bf9e89e2ae8

Selecionar
eas build:configure
seleccionar iOS

Para compilacion a produccion
eas build --platform ios --profile production

Para Subir a App Store Connect
eas submit --platform ios --profile production

https://expo.dev/accounts/ebsoltech/projects/coosanjerfit/builds/55f5c719-bc45-4707-817e-715a14c033e6

https://docs.expo.dev/submit/ios/

eas build --platform ios --profile production --local 

eas build --platform ios --profile production --auto-submit
eas build --platform ios --profile production --non-interactive --auto-submit

Emulador
npx react-native run-ios

Para ambiente fisico
npm install --save-dev @react-native-community/cli
npx expo prebuild
npx expo start --dev-client
xed ios
xcrun simctl list devices

npx expo run:ios --device "iPhone 16 Pro Max"
npx expo run:ios --device "iPad Pro 13-inch (M4)"
npx expo run:ios --device "Apple Watch Ultra 2 (49mm)"
xcrun simctl boot "Apple Watch Ultra (2nd generation)"



brew install cocoapods
fastlane --version
brew install fastlane

cd ios
pod install
cd .. 
npx expo start

listar los dispositivos disponibles
xcrun xctrace list devices
Fisico
npx react-native run-ios --device "YhovaEB"

# Republicar nueva version. 

Se debe aumentar el ultimo digito del 
en el app.json de la ultima posicion y
se debe aumentar el digito del ios build


