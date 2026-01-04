import React, { useState, useEffect, useCallback } from 'react';

// =============================================================================
// IMAGE CONFIGURATION
// =============================================================================
// Place images in: /public/images/{topic}/
// Naming: lowercase, hyphens for spaces (e.g., "french-fries.png")
// =============================================================================

const IMAGE_BASE_PATH = "/images";

// Rating definitions
const RATINGS = [
  { id: 1, emoji: '✓', label: 'Monthly Review', description: 'You know this well', color: 'bg-green-500' },
  { id: 2, emoji: '💬', label: "Can't use in conversation", description: 'Recognition only', color: 'bg-blue-500' },
  { id: 3, emoji: '✍', label: "Can't write in Burmese", description: 'Speaking but not writing', color: 'bg-yellow-500' },
  { id: 4, emoji: '🤔', label: "Understand but can't use", description: 'Passive knowledge', color: 'bg-orange-500' },
  { id: 5, emoji: '❌', label: "Don't know at all", description: 'Need to learn', color: 'bg-red-500' },
];

// =============================================================================
// COMPLETE VOCABULARY DATA FROM CSV
// =============================================================================

const TOPICS_DATA = {
  colours: {
    id: 'colours',
    title: { burmese: 'အရောင်များ', devanagari: 'अ1यौं2म्या3', english: 'Colours' },
    description: { burmese: 'ဒါကဘာအရောင်လဲ။', devanagari: 'दा2ग1बा2अ1यौं2ले³¹13။', english: 'What colour is this?' },
    hasImages: false,
    items: [
      { id: 'red', burmese: 'အနီရောင်', devanagari: 'अ1नि2यौं2', english: 'Red', image: 'red.png', colorCode: '#EF4444' },
      { id: 'blue', burmese: 'အပြာ', devanagari: 'अ1प्या2', english: 'Blue', image: 'blue.png', colorCode: '#3B82F6' },
      { id: 'yellow', burmese: 'အဝါရောင်', devanagari: 'अ1वा2यौं2', english: 'Yellow', image: 'yellow.png', colorCode: '#EAB308' },
      { id: 'green', burmese: 'အစိမ်းရောင်', devanagari: 'अ1झेन23यौं2', english: 'Green', image: 'green.png', colorCode: '#22C55E' },
      { id: 'orange', burmese: 'လိမ္မော်ရောင်', devanagari: 'लि1म्मा1यौं2', english: 'Orange', image: 'orange.png', colorCode: '#F97316' },
      { id: 'pink', burmese: 'ပန်းရောင်', devanagari: 'पं13यौं2', english: 'Pink', image: 'pink.png', colorCode: '#EC4899' },
      { id: 'purple', burmese: 'ခရမ်းရောင်', devanagari: 'ख1यं23यौं2', english: 'Purple', image: 'purple.png', colorCode: '#A855F7' },
      { id: 'brown', burmese: 'အညို', devanagari: 'अ1ज्ञो2', english: 'Brown', image: 'brown.png', colorCode: '#A16207' },
      { id: 'white', burmese: 'အဖြူ', devanagari: 'अ1फ्यु2', english: 'White', image: 'white.png', colorCode: '#F8FAFC' },
      { id: 'black', burmese: 'အနက်ရောင်', devanagari: 'अ1नेतयौं2', english: 'Black', image: 'black.png', colorCode: '#1E293B' },
    ]
  },
  animals: {
    id: 'animals',
    title: { burmese: 'တိရစ္ဆာန်များ', devanagari: 'ति1य1स्साम्या3', english: 'Animals' },
    description: { burmese: 'ဒီတိရစ္ဆာန်ကဘာလဲ။', devanagari: 'दि2ति1य1स्साक1बा2ले³¹13။', english: 'What is this animal?' },
    hasImages: true,
    items: [
      { id: 'dog', burmese: 'ခွေး', devanagari: 'ख्वे3', english: 'Dog', image: 'dog.png' },
      { id: 'cat', burmese: 'ကြောင်', devanagari: 'चौं2', english: 'Cat', image: 'cat.png' },
      { id: 'lion', burmese: 'ခြင်္သေ့', devanagari: 'छिं2दे1', english: 'Lion', image: 'lion.png' },
      { id: 'sparrow', burmese: 'စာငှက်', devanagari: 'सा2ङ्हेत', english: 'Sparrow', image: 'sparrow.png' },
      { id: 'rabbit', burmese: 'ယုန်', devanagari: 'यों12', english: 'Rabbit', image: 'rabbit.png' },
      { id: 'pig', burmese: 'ဝက်', devanagari: 'वेत', english: 'Pig', image: 'pig.png' },
      { id: 'cow', burmese: 'နွားမ', devanagari: 'न्वा3म1', english: 'Cow', image: 'cow.png' },
      { id: 'ox', burmese: 'နွား', devanagari: 'न्वा3', english: 'Ox', image: 'ox.png' },
      { id: 'elephant', burmese: 'ဆင်', devanagari: 'सिन2', english: 'Elephant', image: 'elephant.png' },
      { id: 'horse', burmese: 'မြင်း', devanagari: 'म्यिन3', english: 'Horse', image: 'horse.png' },
      { id: 'monkey', burmese: 'မျောက်', devanagari: 'म्यौ?1', english: 'Monkey', image: 'monkey.png' },
      { id: 'bear', burmese: 'ဝက်ဝံ', devanagari: 'वेतवं32', english: 'Bear', image: 'bear.png' },
      { id: 'giraffe', burmese: 'သစ်ကုလားအုတ်', devanagari: 'थे?2गु1ला3ओट', english: 'Giraffe', image: 'giraffe.png' },
    ]
  },
  food: {
    id: 'food',
    title: { burmese: 'အစားအသောက်', devanagari: 'अ1झा3अ1दौ?1', english: 'Food' },
    description: { burmese: 'အစားအသောက်', devanagari: 'अ1झा3अ1दौ?1', english: "I'll take it." },
    hasImages: true,
    items: [
      { id: 'salad', burmese: 'သုပ်', devanagari: 'थोप', english: 'Salad', image: 'salad.png' },
      { id: 'sandwich', burmese: 'အသားညှပ်ပေါင်မုန့်', devanagari: 'अ1दा3जत2बौं2मों11', english: 'Sandwich', image: 'sandwich.png' },
      { id: 'hamburger', burmese: 'ဟမ်ဘာဂါ', devanagari: 'हं22बा2गा2', english: 'Hamburger', image: 'hamburger.png' },
      { id: 'french-fries', burmese: 'အာလူးချောင်းကြော်', devanagari: 'आ2लु3छौं3चौ2', english: 'French fries', image: 'french-fries.png' },
      { id: 'pizza', burmese: 'ပီဇာ', devanagari: 'पि2जा2', english: 'Pizza', image: 'pizza.png' },
      { id: 'pasta', burmese: 'ခေါက်ဆွဲ', devanagari: 'खौ?1स्वे³¹13', english: 'Pasta', image: 'pasta.png' },
      { id: 'bread', burmese: 'မုန့်', devanagari: 'मों11', english: 'Bread', image: 'bread.png' },
      { id: 'rice', burmese: 'ထမင်း', devanagari: 'थ1मिन3', english: 'Cooked Rice', image: 'rice.png' },
      { id: 'egg', burmese: 'ကြက်ဥ', devanagari: 'चेतउ1', english: 'Egg', image: 'egg.png' },
      { id: 'cheese', burmese: 'ဒိန်ခဲ', devanagari: 'देन12गे³¹13', english: 'Cheese', image: 'cheese.png' },
      { id: 'yogurt', burmese: 'ဒိန်ချဥ်', devanagari: 'देन12छिन2', english: 'Yogurt', image: 'yogurt.png' },
      { id: 'ham', burmese: 'ဝက်ပေါင်ခြောက်', devanagari: 'वेतबौं2छौ?1', english: 'Ham', image: 'ham.png' },
      { id: 'sausage', burmese: 'ဝက်အူချောင်း', devanagari: 'वेतउ2छौं3', english: 'Sausage', image: 'sausage.png' },
      { id: 'fish', burmese: 'ငါး', devanagari: 'ङा3', english: 'Fish', image: 'fish.png' },
      { id: 'chicken', burmese: 'ကြက်သား', devanagari: 'चेतदा3', english: 'Chicken', image: 'chicken.png' },
      { id: 'beef', burmese: 'အမဲသား', devanagari: 'अ1मे³¹13दा3', english: 'Beef', image: 'beef.png' },
    ]
  },
  vegetables: {
    id: 'vegetables',
    title: { burmese: 'အသီးအရွက်', devanagari: 'अ1दि3अ1य्वेत', english: 'Vegetables' },
    description: { burmese: 'မင်း မစားနိုင်တဲ့ အရာ ရှိလား။', devanagari: 'मिन3म1झा3नाइन2दे³¹111अ1या2शि1ला3။', english: 'Do you have something you cannot eat?' },
    hasImages: true,
    items: [
      { id: 'tomato', burmese: 'ခရမ်းချဉ်သီး', devanagari: 'ख1यं23छ1', english: 'Tomato', image: 'tomato.png' },
      { id: 'potato', burmese: 'အာလူး', devanagari: 'आ2लु3', english: 'Potato', image: 'potato.png' },
      { id: 'carrot', burmese: 'မုန်လာဥနီ', devanagari: 'मों12ला2उ1नि2', english: 'Carrot', image: 'carrot.png' },
      { id: 'onion', burmese: 'ကြက်သွန်နီ', devanagari: 'चेतदुन12नि2', english: 'Onion', image: 'onion.png' },
      { id: 'leek', burmese: 'ဂျပန်ကြက်သွန်မြိတ်', devanagari: 'ज1बं12चेतदुन12म्यै1', english: 'Japanese leek', image: 'leek.png' },
      { id: 'mushroom', burmese: 'မှို', devanagari: 'म्हो2', english: 'Mushroom', image: 'mushroom.png' },
      { id: 'green-pepper', burmese: 'ငရုတ်ပွစိမ်း', devanagari: 'ङ1योटप्व1झेन23', english: 'Green pepper', image: 'green-pepper.png' },
      { id: 'radish', burmese: 'မုန်လာဥ', devanagari: 'मों12ला2उ1', english: 'Radish', image: 'radish.png' },
      { id: 'legume', burmese: 'ပဲပင်', devanagari: 'पे³¹13बिन2', english: 'Legume', image: 'legume.png' },
      { id: 'cabbage', burmese: 'ဂေါ်ဖီထုပ်', devanagari: 'गौ2फि2दोप', english: 'Cabbage', image: 'cabbage.png' },
      { id: 'spinach', burmese: 'ဟင်းနုနွယ်ရွက်', devanagari: 'हिन3नु1न्वे³¹12य्वेत', english: 'Spinach', image: 'spinach.png' },
      { id: 'lettuce', burmese: 'ဆလတ်ရွက်', devanagari: 'स1लत1य्वेत', english: 'Lettuce', image: 'lettuce.png' },
      { id: 'cucumber', burmese: 'သခွားသီး', devanagari: 'थ1ख्वा3दि3', english: 'Cucumber', image: 'cucumber.png' },
      { id: 'pumpkin', burmese: 'ရွှေဖရုံသီး', devanagari: 'य्हवे2फ1यों22दि3', english: 'Pumpkin', image: 'pumpkin.png' },
      { id: 'broccoli', burmese: 'ဘရိုကိုလီ', devanagari: 'ब1यो2गो2लि2', english: 'Broccoli', image: 'broccoli.png' },
    ]
  },
  fruits: {
    id: 'fruits',
    title: { burmese: 'သစ်သီးများ', devanagari: 'थे?2दि3म्या3', english: 'Fruits' },
    description: { burmese: 'မင်းအကြိုက်ဆုံးအသီးကဘာလဲ။', devanagari: 'मिन3अ1चाइझों23अ1दि3ग1बा2ले³¹13।', english: 'What is your favorite fruit?' },
    hasImages: true,
    items: [
      { id: 'apple', burmese: 'ပန်းသီး', devanagari: 'पं13दि3', english: 'Apple', image: 'apple.png' },
      { id: 'lemon', burmese: 'သံပယိုသီး', devanagari: 'थं32ब1यो2दि3', english: 'Lemon', image: 'lemon.png' },
      { id: 'mango', burmese: 'သရက်သီး', devanagari: 'थ1येतदि3', english: 'Mango', image: 'mango.png' },
      { id: 'pomegranate', burmese: 'သလဲသီး', devanagari: 'थ1ले³¹13दि3', english: 'Pomegranate', image: 'pomegranate.png' },
      { id: 'strawberry', burmese: 'စတော်ဘယ်ရီ', devanagari: 'स1तौ2बे³¹12रि2', english: 'Strawberry', image: 'strawberry.png' },
      { id: 'orange', burmese: 'လိမ္မော်သီး', devanagari: 'लि1म्मा1दि3', english: 'Orange', image: 'orange.png' },
      { id: 'pineapple', burmese: 'နာနတ်သီး', devanagari: 'ना2नत1दि3', english: 'Pineapple', image: 'pineapple.png' },
      { id: 'melon', burmese: 'သခွားမသီး', devanagari: 'थ1ख्वा3म1दि3', english: 'Melon', image: 'melon.png' },
      { id: 'grapes', burmese: 'စပျစ်သီး', devanagari: 'स1प्ये?2दि3', english: 'Grapes', image: 'grapes.png' },
      { id: 'banana', burmese: 'ငှက်ပျောသီး', devanagari: 'ङ्हेतप्यौ3दि3', english: 'Banana', image: 'banana.png' },
      { id: 'cherry', burmese: 'ချယ်ရီ', devanagari: 'चे³¹12रि2', english: 'Cherry', image: 'cherry.png' },
      { id: 'guava', burmese: 'မာလကာ', devanagari: 'मा2ल1गा2', english: 'Guava', image: 'guava.png' },
      { id: 'watermelon', burmese: 'ဖရဲသီး', devanagari: 'फ1ये³¹13दि3', english: 'Watermelon', image: 'watermelon.png' },
      { id: 'pear', burmese: 'သစ်တော်သီး', devanagari: 'थे?2दौ2दि3', english: 'Pear', image: 'pear.png' },
      { id: 'fig', burmese: 'သဖန်းသီး', devanagari: 'थ1फं13दि3', english: 'Fig', image: 'fig.png' },
      { id: 'kiwi', burmese: 'ကီဝီသီး', devanagari: 'कि2वि2दि3', english: 'Kiwi', image: 'kiwi.png' },
      { id: 'papaya', burmese: 'သင်္ဘောသီး', devanagari: 'थिं2बौ3दि3', english: 'Papaya', image: 'papaya.png' },
      { id: 'coconut', burmese: 'အုန်းသီး', devanagari: 'ओन13दि3', english: 'Coconut', image: 'coconut.png' },
      { id: 'grapefruit', burmese: 'ဂရိတ်ဖရု', devanagari: 'ग1यै1फ1यु1', english: 'Grapefruit', image: 'grapefruit.png' },
    ]
  },
  transportation: {
    id: 'transportation',
    title: { burmese: 'မိုဘိုင်း', devanagari: 'मो2बाइन3', english: 'Transportation' },
    description: { burmese: 'ဘယ်သွားရမလဲ', devanagari: 'बे³¹12थ्वा3य1म1ले³¹13', english: 'Where should I go?' },
    hasImages: true,
    items: [
      { id: 'bus', burmese: 'ဘတ်စ်ကား', devanagari: 'बत1झ1', english: 'Bus', image: 'bus.png' },
      { id: 'train', burmese: 'ရထား', devanagari: 'य1दा3', english: 'Train', image: 'train.png' },
      { id: 'car', burmese: 'ကား', devanagari: 'का3', english: 'Car', image: 'car.png' },
      { id: 'airplane', burmese: 'လေယာဉ်ပျံ', devanagari: 'ले2या2', english: 'Airplane', image: 'airplane.png' },
      { id: 'ship', burmese: 'သင်္ဘော', devanagari: 'थिं2बौ3', english: 'Ship', image: 'ship.png' },
      { id: 'boat', burmese: 'လှေ', devanagari: 'ल्हे2', english: 'Boat', image: 'boat.png' },
      { id: 'submarine', burmese: 'ရေငုပ်သင်္ဘော', devanagari: 'ये2ङोपदिं2बौ3', english: 'Submarine', image: 'submarine.png' },
      { id: 'bicycle', burmese: 'စက်ဘီး', devanagari: 'सेतबि3', english: 'Bicycle', image: 'bicycle.png' },
      { id: 'subway', burmese: 'မြေအောက်ရထား', devanagari: 'म्ये2औतय1दा3', english: 'Subway', image: 'subway.png' },
      { id: 'motorbike', burmese: 'ဆိုင်ကယ်', devanagari: 'साइन2गे³¹12', english: 'Motorbike', image: 'motorbike.png' },
      { id: 'helicopter', burmese: 'ရဟတ်ယာဉ်', devanagari: 'य1हत1या2', english: 'Helicopter', image: 'helicopter.png' },
      { id: 'taxi', burmese: 'တက္ကစီ', devanagari: 'त1क्कसि2', english: 'Taxi', image: 'taxi.png' },
    ]
  },
  family: {
    id: 'family',
    title: { burmese: 'မိသားစု', devanagari: 'मि1दा3झु1', english: 'Family' },
    description: { burmese: 'ဘယ်သူလဲ?', devanagari: 'बे³¹12दु2ले³¹111', english: 'Who is it?' },
    hasImages: true,
    items: [
      { id: 'i', burmese: 'ငါ', devanagari: 'ङा2', english: 'I', image: 'i.png' },
      { id: 'father', burmese: 'ဖေဖေ', devanagari: 'फे2फे2', english: 'Father', image: 'father.png' },
      { id: 'mother', burmese: 'မေမေ', devanagari: 'मे2मे2', english: 'Mother', image: 'mother.png' },
      { id: 'elder-brother', burmese: 'အစ်ကိုအကြီး', devanagari: 'आ1को2आ1क्यि3', english: 'Elder brother', image: 'elder-brother.png' },
      { id: 'elder-sister', burmese: 'အစ်မ', devanagari: 'अ1मा1', english: 'Elder sister', image: 'elder-sister.png' },
      { id: 'younger-brother', burmese: 'ညီအငယ်', devanagari: 'ज्ञि2अ1ङे³¹12', english: 'Younger brother', image: 'younger-brother.png' },
      { id: 'younger-sister', burmese: 'ညီမအငယ်', devanagari: 'ज्ञि2म1अ1ङे³¹12', english: 'Younger sister', image: 'younger-sister.png' },
      { id: 'grandfather', burmese: 'အဖိုး', devanagari: 'अ1फोए', english: 'Grandfather', image: 'grandfather.png' },
      { id: 'grandmother', burmese: 'အဖွား', devanagari: 'अ1फ्वा3', english: 'Grandmother', image: 'grandmother.png' },
      { id: 'son', burmese: 'သားတော်', devanagari: 'था3दौ2', english: 'Son', image: 'son.png' },
      { id: 'daughter', burmese: 'သမီး', devanagari: 'थ1मि3', english: 'Daughter', image: 'daughter.png' },
      { id: 'husband', burmese: 'ခင်ပွန်း', devanagari: 'खिन2बुन13', english: 'Husband', image: 'husband.png' },
      { id: 'wife', burmese: 'မယား', devanagari: 'म1या3', english: 'Wife', image: 'wife.png' },
    ]
  },
  body: {
    id: 'body',
    title: { burmese: 'ခန္ဓာကိုယ်', devanagari: 'ख1न1', english: 'Body' },
    description: { burmese: 'ဘယ်နားကနာနေပါလဲ?', devanagari: 'बे³¹12ना3ग1ना2ने2बा2ले³¹111', english: 'Where does it hurt?' },
    hasImages: true,
    items: [
      { id: 'eye', burmese: 'မျက်လုံး', devanagari: 'म्येतलों23', english: 'Eye', image: 'eye.png' },
      { id: 'nose', burmese: 'နှာခေါင်း', devanagari: 'न्हा2गौं3', english: 'Nose', image: 'nose.png' },
      { id: 'mouth', burmese: 'ပါးစပ်', devanagari: 'पा3झत2', english: 'Mouth', image: 'mouth.png' },
      { id: 'face', burmese: 'မျက်နှာ', devanagari: 'म्येतन्हा2', english: 'Face', image: 'face.png' },
      { id: 'neck', burmese: 'လည်ပင်း', devanagari: 'ले³¹22बिन3', english: 'Neck', image: 'neck.png' },
      { id: 'hair', burmese: 'ဆံပင်', devanagari: 'सं32बिन2', english: 'Hair', image: 'hair.png' },
      { id: 'ear', burmese: 'နား', devanagari: 'ना3', english: 'Ear', image: 'ear.png' },
      { id: 'tooth', burmese: 'သွား', devanagari: 'थ्वा3', english: 'Tooth', image: 'tooth.png' },
      { id: 'finger', burmese: 'လက်ညှိုး', devanagari: 'लेतज्ञ्होए', english: 'Finger', image: 'finger.png' },
      { id: 'hand', burmese: 'လက်', devanagari: 'लेत', english: 'Hand', image: 'hand.png' },
      { id: 'arm', burmese: 'လက်မောင်း', devanagari: 'लेतमौं3', english: 'Arm', image: 'arm.png' },
      { id: 'shoulder', burmese: 'ပခုံး', devanagari: 'प1गों23', english: 'Shoulder', image: 'shoulder.png' },
      { id: 'toes', burmese: 'ခြေချောင်းများ', devanagari: 'छे2छौं3म्या3', english: 'Toes', image: 'toes.png' },
      { id: 'legs', burmese: 'ခြေထောက်များ', devanagari: 'छे2दौ?1म्या3', english: 'Legs', image: 'legs.png' },
      { id: 'stomach', burmese: 'ဗိုက်', devanagari: 'बाइ', english: 'Stomach', image: 'stomach.png' },
    ]
  },
  dates: {
    id: 'dates',
    title: { burmese: 'ရက်စွဲ', devanagari: 'येतस्वे³¹13', english: 'Date' },
    description: { burmese: 'ဒီနေ့ဘာနေ့ပါလဲ?', devanagari: 'दि2ने1बा2ने1बा2ले³¹111', english: 'What day is today?' },
    hasImages: false,
    items: [
      { id: 'day', burmese: 'နေ့', devanagari: 'ने1', english: 'Day', image: 'day.png' },
      { id: 'today', burmese: 'ဒီနေ့', devanagari: 'दि2ने1', english: 'Today', image: 'today.png' },
      { id: 'yesterday', burmese: 'မနေ့က', devanagari: 'म1ने1ग1', english: 'Yesterday', image: 'yesterday.png' },
      { id: 'tomorrow', burmese: 'မနက်ဖြန်', devanagari: 'म1नेतफ्यं12', english: 'Tomorrow', image: 'tomorrow.png' },
      { id: 'sunday', burmese: 'တနင်္ဂနွေ', devanagari: 'त1निं2ग1न्वे2', english: 'Sunday', image: 'sunday.png' },
      { id: 'monday', burmese: 'တနင်္လာနေ့', devanagari: 'त1निं2ला2ने1', english: 'Monday', image: 'monday.png' },
      { id: 'tuesday', burmese: 'အင်္ဂါ', devanagari: 'इन122गा2', english: 'Tuesday', image: 'tuesday.png' },
      { id: 'wednesday', burmese: 'ဗုဒ္ဓဟူးနေ့', devanagari: 'बु1द1', english: 'Wednesday', image: 'wednesday.png' },
      { id: 'thursday', burmese: 'ကြာသပတေးနေ့', devanagari: 'चा2द1ब1दे3ने1', english: 'Thursday', image: 'thursday.png' },
      { id: 'friday', burmese: 'သောကြာ', devanagari: 'थौ3चा2', english: 'Friday', image: 'friday.png' },
      { id: 'saturday', burmese: 'စနေနေ့', devanagari: 'स1ने2ने1', english: 'Saturday', image: 'saturday.png' },
      { id: 'january', burmese: 'ဇန်နဝါရီလ', devanagari: 'जं12न1वा2यि2ल1', english: 'January', image: 'january.png' },
      { id: 'february', burmese: 'ဖေဖော်ဝါရီ', devanagari: 'फे2फौ2वा2यि2', english: 'February', image: 'february.png' },
      { id: 'march', burmese: 'မတ်လ', devanagari: 'मत1ल1', english: 'March', image: 'march.png' },
      { id: 'april', burmese: 'ဧပြီလ', devanagari: 'इ1प्यि2ल1', english: 'April', image: 'april.png' },
      { id: 'may', burmese: 'မေ', devanagari: 'मे2', english: 'May', image: 'may.png' },
      { id: 'june', burmese: 'ဇွန်လ', devanagari: 'जुन12ल1', english: 'June', image: 'june.png' },
      { id: 'july', burmese: 'ဇူလိုင်လ', devanagari: 'जु2लाइन2ल1', english: 'July', image: 'july.png' },
      { id: 'august', burmese: 'သြဂုတ်လ', devanagari: 'थ्य1गोटल1', english: 'August', image: 'august.png' },
      { id: 'september', burmese: 'စက်တင်ဘာ', devanagari: 'सेतदिन2बा2', english: 'September', image: 'september.png' },
      { id: 'october', burmese: 'အောက်တိုဘာလ', devanagari: 'औतदो2बा2ल1', english: 'October', image: 'october.png' },
      { id: 'november', burmese: 'နိုဝင်ဘာလ', devanagari: 'नो2विन2बा2ल1', english: 'November', image: 'november.png' },
    ]
  },
  weather: {
    id: 'weather',
    title: { burmese: 'ရာသီဥတု', devanagari: 'या2दि2उ1दु1', english: 'Weather' },
    description: { burmese: 'ရာသီဥတု ဘယ်လိုလဲ။', devanagari: 'या2दि2उ1दु1बे³¹12लो2ले³¹13।', english: 'How is the weather?' },
    hasImages: false,
    items: [
      { id: 'sunny', burmese: 'နေသာသည်။', devanagari: 'ने2दा2दे³¹22।', english: 'Sunny', image: 'sunny.png' },
      { id: 'cloudy', burmese: 'တိမ်ထူတယ်။', devanagari: 'तेन22दु2दे³¹12।', english: 'Cloudy', image: 'cloudy.png' },
      { id: 'rain', burmese: 'မိုး', devanagari: 'मोए', english: 'Rain', image: 'rain.png' },
      { id: 'snow', burmese: 'နှင်း', devanagari: 'न्हिन3', english: 'Snow', image: 'snow.png' },
      { id: 'wind', burmese: 'လေတိုက်သည်။', devanagari: 'ले2दाइदे³¹22।', english: 'Wind', image: 'wind.png' },
      { id: 'fog', burmese: 'မြူနှင်း', devanagari: 'म्यु2न्हिन3', english: 'Fog', image: 'fog.png' },
      { id: 'hot', burmese: 'ပူတယ်။', devanagari: 'पु2दे³¹12।', english: 'Hot', image: 'hot.png' },
      { id: 'cold', burmese: 'အေး', devanagari: 'ए3', english: 'Cold', image: 'cold.png' },
      { id: 'warm', burmese: 'နွေးထွေးတယ်။', devanagari: 'न्वे3थ्वे3दे³¹12।', english: 'Warm', image: 'warm.png' },
      { id: 'spring', burmese: 'နွေဦး', devanagari: 'न्वे2', english: 'Spring', image: 'spring.png' },
      { id: 'summer', burmese: 'နွေရာသီ', devanagari: 'न्वे2या2दि2', english: 'Summer', image: 'summer.png' },
      { id: 'autumn', burmese: 'ဆောင်းဦး', devanagari: 'सौं3', english: 'Autumn', image: 'autumn.png' },
      { id: 'winter', burmese: 'ဆောင်းရာသီ', devanagari: 'सौं3या2दि2', english: 'Winter', image: 'winter.png' },
    ]
  },
  drinks: {
    id: 'drinks',
    title: { burmese: 'သောက်ပါ။', devanagari: 'थौ?1बा2।', english: 'Drinks' },
    description: { burmese: 'သင်ဘာသောက်ချင်ပါသလဲ?', devanagari: 'थिन2बा2दौ?1छिन2बा2द1ले³¹111', english: 'What would you like to drink?' },
    hasImages: true,
    items: [
      { id: 'water', burmese: 'ရေ', devanagari: 'ये2', english: 'Water', image: 'water.png' },
      { id: 'orange-juice', burmese: 'လိမ္မော်သီးဖျော်ရည်', devanagari: 'लि1म1', english: 'Orange juice', image: 'orange-juice.png' },
      { id: 'fruit-juice', burmese: 'သစ်သီးဖျော်ရည်', devanagari: 'थे?2दि3फ्यौ2ये³¹22', english: 'Fruit juice', image: 'fruit-juice.png' },
      { id: 'cola', burmese: 'ကိုလာ', devanagari: 'को2ला2', english: 'Cola', image: 'cola.png' },
      { id: 'soft-drink', burmese: 'အချိုရည်', devanagari: 'अ1छो2ये³¹22', english: 'Soft drink', image: 'soft-drink.png' },
      { id: 'beer', burmese: 'ဘီယာ', devanagari: 'बि2या2', english: 'Beer', image: 'beer.png' },
      { id: 'wine', burmese: 'ဝိုင်', devanagari: 'वाइन2', english: 'Wine', image: 'wine.png' },
      { id: 'tea', burmese: 'လက်ဖက်ရည်', devanagari: 'लेतफेतये³¹22', english: 'Tea', image: 'tea.png' },
      { id: 'coffee', burmese: 'ကော်ဖီ', devanagari: 'कौ2फि2', english: 'Coffee', image: 'coffee.png' },
      { id: 'cocoa', burmese: 'ကိုကိုး', devanagari: 'को2गोए', english: 'Cocoa', image: 'cocoa.png' },
    ]
  },
  sports: {
    id: 'sports',
    title: { burmese: 'အားကစား', devanagari: 'आ3ग1झा3', english: 'Sports' },
    description: { burmese: 'မင်းအားကစားလုပ်နေတာလား။', devanagari: 'मिन3आ3ग1झा3लोपने2दा2ला3।', english: 'Are you doing sports?' },
    hasImages: true,
    items: [
      { id: 'running', burmese: 'ပြေးသည်။', devanagari: 'प्ये3दे³¹22।', english: 'Running', image: 'running.png' },
      { id: 'swimming', burmese: 'ရေကူးတယ်။', devanagari: 'ये2गु3दे³¹12।', english: 'Swimming', image: 'swimming.png' },
      { id: 'skiing', burmese: 'နှင်းလျှောစီးခြင်း။', devanagari: 'न्हिन3ल्य1', english: 'Skiing', image: 'skiing.png' },
      { id: 'soccer', burmese: 'ဘောလုံး', devanagari: 'बौ3लों23', english: 'Soccer', image: 'soccer.png' },
      { id: 'basketball', burmese: 'ဘတ်စကက်ဘော', devanagari: 'बत1झ1गेतबौ3', english: 'Basketball', image: 'basketball.png' },
      { id: 'volleyball', burmese: 'ဘော်လီဘော', devanagari: 'बौ2लि2बौ3', english: 'Volleyball', image: 'volleyball.png' },
      { id: 'baseball', burmese: 'ဘေ့စ်ဘော', devanagari: 'बे1झ1', english: 'Baseball', image: 'baseball.png' },
      { id: 'table-tennis', burmese: 'စားပွဲတင်တင်းနစ်', devanagari: 'सा3प्वे³¹13दिन2दिन3ने?2', english: 'Table tennis', image: 'table-tennis.png' },
      { id: 'tennis', burmese: 'တင်းနစ်', devanagari: 'तिन3ने?2', english: 'Tennis', image: 'tennis.png' },
      { id: 'badminton', burmese: 'ကြက်တောင်ရိုက်', devanagari: 'चेतदौं2याइ', english: 'Badminton', image: 'badminton.png' },
    ]
  },
  hobby: {
    id: 'hobby',
    title: { burmese: 'ဝါသနာ', devanagari: 'वा2द1ना2', english: 'Hobby' },
    description: { burmese: 'မင်းရဲ့ဝါသနာကဘာလဲ', devanagari: 'मिन3ये³¹111वा2द1ना2ग1बा2ले³¹13', english: 'What is your hobby?' },
    hasImages: true,
    items: [
      { id: 'reading', burmese: 'ဖတ်ရန်', devanagari: 'फत1यं12', english: 'To read', image: 'reading.png' },
      { id: 'cooking', burmese: 'ချက်ပြုတ်ရန်', devanagari: 'छेतप्योटयं12', english: 'To cook', image: 'cooking.png' },
      { id: 'drawing', burmese: 'ပုံတစ်ခုဆွဲပါ။', devanagari: 'पों22दे?2गु1स्वे³¹13बा2।', english: 'Draw a picture', image: 'drawing.png' },
      { id: 'piano', burmese: 'စန္ဒယားတီးတယ်။', devanagari: 'स1न1', english: 'Play piano', image: 'piano.png' },
      { id: 'music', burmese: 'ဂီတတူရိယာတစ်ခုတီးပါ။', devanagari: 'गि2द1दु2यि1या2दे?2गु1दि3बा2।', english: 'Play instrument', image: 'music.png' },
      { id: 'singing', burmese: 'သီချင်းဆို', devanagari: 'थि2छिन3झो2', english: 'Sing', image: 'singing.png' },
      { id: 'dancing', burmese: 'ကခုန်သည်။', devanagari: 'क1गों12दे³¹22।', english: 'Dance', image: 'dancing.png' },
    ]
  },
  tableware: {
    id: 'tableware',
    title: { burmese: 'ပန်းကန်ခွက်ယောက်', devanagari: 'पं13गं12ख्वेतयौ?1', english: 'Tableware' },
    description: { burmese: '', devanagari: '', english: '' },
    hasImages: true,
    items: [
      { id: 'fork', burmese: 'အမဲချိတ်', devanagari: 'अ1मे³¹13छै1', english: 'Fork', image: 'fork.png' },
      { id: 'knife', burmese: 'ဓား', devanagari: 'धा3', english: 'Knife', image: 'knife.png' },
      { id: 'spoon', burmese: 'ဇွန်း', devanagari: 'जुन13', english: 'Spoon', image: 'spoon.png' },
      { id: 'chopsticks', burmese: 'မီးခြစ်', devanagari: 'मि3छे?2', english: 'Chopsticks', image: 'chopsticks.png' },
      { id: 'dish', burmese: 'ပန်းကန်', devanagari: 'पं13गं12', english: 'Dish', image: 'dish.png' },
      { id: 'vessel', burmese: 'ရေယာဉ်', devanagari: 'ये2या2', english: 'Vessel', image: 'vessel.png' },
      { id: 'glass', burmese: 'ဖန်', devanagari: 'फं12', english: 'Glass', image: 'glass.png' },
      { id: 'cup', burmese: 'ဖလား', devanagari: 'फ1ला3', english: 'Cup', image: 'cup.png' },
      { id: 'napkin', burmese: 'လက်သုတ်ပဝါ', devanagari: 'लेतदोटब1वा2', english: 'Napkin', image: 'napkin.png' },
    ]
  },
  seasoning: {
    id: 'seasoning',
    title: { burmese: 'ဟင်းခတ်အနှစ်', devanagari: 'हिन3गत1अ1न्हे?2', english: 'Seasoning' },
    description: { burmese: 'ကျေးဇူးပြုပြီး ယူလို့ရမလား။', devanagari: 'चे3जु3प्यु1प्यि3यु2लो1य1म1ला3।', english: 'Could you please take?' },
    hasImages: true,
    items: [
      { id: 'salt', burmese: 'ဆားငန်', devanagari: 'सा3ङं12', english: 'Salt', image: 'salt.png' },
      { id: 'pepper', burmese: 'ငရုတ်ကောင်း', devanagari: 'ङ1योटगौं3', english: 'Pepper', image: 'pepper.png' },
      { id: 'sugar', burmese: 'သကြား', devanagari: 'थ1चा3', english: 'Sugar', image: 'sugar.png' },
      { id: 'mustard', burmese: 'မုန်ညင်း', devanagari: 'मों12ज्ञिन3', english: 'Mustard', image: 'mustard.png' },
      { id: 'oil', burmese: 'ဆီ', devanagari: 'सि2', english: 'Oil', image: 'oil.png' },
      { id: 'vinegar', burmese: 'ရှလကာရည်', devanagari: 'श1ल1गा2ये³¹22', english: 'Vinegar', image: 'vinegar.png' },
      { id: 'jam', burmese: 'ယို', devanagari: 'यो2', english: 'Jam', image: 'jam.png' },
      { id: 'honey', burmese: 'ဟန်နီ', devanagari: 'हं12नि2', english: 'Honey', image: 'honey.png' },
      { id: 'butter', burmese: 'ထောပတ်', devanagari: 'थौ3बत1', english: 'Butter', image: 'butter.png' },
    ]
  },
};

// Helper to get image URL
const getImageUrl = (topicId, imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  return `${IMAGE_BASE_PATH}/${topicId}/${imageName}`;
};

// Local storage helpers
const STORAGE_KEY = 'kg_chart_ratings';
const loadRatings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};
const saveRatings = (ratings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
};

// =============================================================================
// COMPONENTS
// =============================================================================

// Topic Navigation
const TopicNav = ({ topics, activeTopic, onSelect }) => (
  <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
    <div className="max-w-7xl mx-auto px-2">
      <div className="flex overflow-x-auto py-2 gap-1 scrollbar-hide">
        {Object.values(topics).map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTopic === topic.id
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {topic.title.english}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Chart Header (matches your Excel layout exactly)
const ChartHeader = ({ topic }) => (
  <div className="border-2 border-gray-800 mb-0 bg-white">
    <div className="grid grid-cols-4 min-h-24">
      {/* Header Image Cell */}
      <div className="border-r-2 border-gray-800 bg-black p-2 flex items-center justify-center">
        <div className="text-3xl">🍎🍌🍇🍊🍋</div>
      </div>
      {/* Title Cell - Burmese + Devanagari */}
      <div className="border-r-2 border-gray-800 p-3 flex flex-col justify-center items-center">
        <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
          {topic.title.burmese}
        </div>
        <div className="text-xl text-blue-700 mt-1" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {topic.title.devanagari}
        </div>
      </div>
      {/* English Question Cell */}
      <div className="border-r-2 border-gray-800 p-3 flex items-center justify-center">
        <div className="text-base text-center font-medium text-gray-700">
          {topic.description.english}
        </div>
      </div>
      {/* Burmese Question Cell */}
      <div className="p-3 flex flex-col justify-center items-center">
        <div className="text-base text-red-700 text-center" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
          {topic.description.burmese}
        </div>
        <div className="text-sm text-red-600 text-center mt-1" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {topic.description.devanagari}
        </div>
      </div>
    </div>
  </div>
);

// Single Vocabulary Cell (matches Excel grid layout exactly)
const VocabCell = ({ item, topic, rating, onRate, onShowDetail, showEnglish }) => {
  const [imageError, setImageError] = useState(false);
  const currentRating = RATINGS.find(r => r.id === rating);

  return (
    <div 
      className="border border-gray-400 bg-white relative group cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onShowDetail(item)}
    >
      {/* Rating indicator */}
      {currentRating && (
        <div className={`absolute top-1 right-1 w-6 h-6 rounded-full ${currentRating.color} text-white text-xs flex items-center justify-center z-10 shadow`}>
          {currentRating.emoji}
        </div>
      )}

      {/* Image */}
      <div className="aspect-square p-2 flex items-center justify-center bg-white border-b border-gray-300">
        {topic.id === 'colours' ? (
          <div 
            className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-inner"
            style={{ backgroundColor: item.colorCode }}
          />
        ) : imageError || !item.image ? (
          <div className="text-4xl">📷</div>
        ) : (
          <img
            src={getImageUrl(topic.id, item.image)}
            alt={item.english}
            className="max-w-full max-h-full object-contain"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Text - Burmese */}
      <div className="p-2 border-b border-gray-200">
        <div className="text-center text-lg font-medium text-gray-800" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
          {item.burmese}
        </div>
      </div>

      {/* Text - Devanagari */}
      <div className="p-2 bg-gray-50">
        <div className="text-center text-md text-blue-700" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {item.devanagari}
        </div>
        {showEnglish && (
          <div className="text-center text-xs text-gray-500 mt-1">
            {item.english}
          </div>
        )}
      </div>

      {/* Quick rate buttons on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-center gap-1">
          {RATINGS.map((r) => (
            <button
              key={r.id}
              onClick={(e) => { e.stopPropagation(); onRate(item.id, r.id); }}
              className={`w-6 h-6 rounded text-xs hover:scale-110 transition-transform ${
                rating === r.id ? r.color + ' text-white' : 'bg-gray-200'
              }`}
              title={r.label}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Vocabulary Grid (matches Excel 5-column layout)
const VocabGrid = ({ topic, ratings, onRate, onShowDetail, showEnglish }) => (
  <div className="border-2 border-gray-800 border-t-0">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {topic.items.map((item) => (
        <VocabCell
          key={item.id}
          item={item}
          topic={topic}
          rating={ratings[`${topic.id}-${item.id}`]}
          onRate={(itemId, ratingId) => onRate(`${topic.id}-${itemId}`, ratingId)}
          onShowDetail={onShowDetail}
          showEnglish={showEnglish}
        />
      ))}
    </div>
  </div>
);

// Detail Modal
const DetailModal = ({ item, topic, rating, onRate, onClose }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          {/* Image */}
          <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-xl border">
            {topic.id === 'colours' ? (
              <div className="w-28 h-28 rounded-xl border-4 border-gray-200" style={{ backgroundColor: item.colorCode }} />
            ) : imageError || !item.image ? (
              <div className="text-6xl">📷</div>
            ) : (
              <img
                src={getImageUrl(topic.id, item.image)}
                alt={item.english}
                className="max-w-full max-h-full object-contain"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Burmese */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
            {item.burmese}
          </h2>

          {/* Devanagari */}
          <div className="text-2xl text-blue-700 mb-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {item.devanagari}
          </div>

          {/* English */}
          <div className="text-xl text-gray-600 mb-6">
            {item.english}
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">Rate your knowledge:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onRate(`${topic.id}-${item.id}`, r.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    rating === r.id 
                      ? r.color + ' text-white shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-8 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Quiz Component
const QuizSection = ({ topics, ratings, onRate }) => {
  const [quizTopic, setQuizTopic] = useState('all');
  const [quizType, setQuizType] = useState('burmese-to-image');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);

  const getAllItems = useCallback(() => {
    if (quizTopic === 'all') {
      return Object.values(topics).flatMap(t => t.items.map(i => ({ ...i, topicId: t.id, topic: t })));
    }
    const topic = topics[quizTopic];
    return topic.items.map(i => ({ ...i, topicId: topic.id, topic }));
  }, [quizTopic, topics]);

  const generateQuestion = useCallback(() => {
    const items = getAllItems();
    if (items.length < 4) return;

    const questionItem = items[Math.floor(Math.random() * items.length)];
    const wrongOptions = items.filter(i => i.id !== questionItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [questionItem, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion(questionItem);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [getAllItems]);

  useEffect(() => {
    generateQuestion();
  }, [quizTopic, quizType, generateQuestion]);

  const handleAnswer = (item) => {
    if (showResult) return;
    setSelectedAnswer(item);
    setShowResult(true);

    const isCorrect = item.id === currentQuestion.id;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (!isCorrect) {
      onRate(`${currentQuestion.topicId}-${currentQuestion.id}`, 5);
    }
  };

  const ImageDisplay = ({ item, isCorrect, isWrong }) => {
    const [error, setError] = useState(false);
    let borderClass = 'border-gray-300';
    if (isCorrect) borderClass = 'border-green-500 border-4 bg-green-50';
    if (isWrong) borderClass = 'border-red-500 border-4 bg-red-50';

    return (
      <div className={`p-4 rounded-xl border-2 ${borderClass} cursor-pointer hover:shadow-lg transition-all`}>
        <div className="w-20 h-20 mx-auto flex items-center justify-center">
          {item.topic?.id === 'colours' ? (
            <div className="w-14 h-14 rounded-lg" style={{ backgroundColor: item.colorCode }} />
          ) : error || !item.image ? (
            <div className="text-3xl">📷</div>
          ) : (
            <img
              src={getImageUrl(item.topicId, item.image)}
              alt=""
              className="max-w-full max-h-full object-contain"
              onError={() => setError(true)}
            />
          )}
        </div>
        {quizType === 'image-to-burmese' && (
          <div className="text-center mt-2 text-xs text-gray-500">{item.english}</div>
        )}
      </div>
    );
  };

  if (!currentQuestion) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Quiz Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={quizTopic}
              onChange={(e) => { setQuizTopic(e.target.value); setScore({ correct: 0, total: 0 }); }}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Topics</option>
              {Object.values(topics).map(t => (
                <option key={t.id} value={t.id}>{t.title.english}</option>
              ))}
            </select>

            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="burmese-to-image">Burmese → Image</option>
              <option value="image-to-burmese">Image → Burmese</option>
              <option value="devanagari-to-image">Devanagari → Image</option>
              <option value="english-to-burmese">English → Burmese</option>
            </select>
          </div>

          <div className="bg-yellow-100 px-4 py-2 rounded-full font-bold text-yellow-800">
            Score: {score.correct}/{score.total} 
            {score.total > 0 && ` (${Math.round(score.correct/score.total*100)}%)`}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="text-center text-gray-500 mb-4">Find the matching:</div>

        {quizType === 'burmese-to-image' && (
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
              {currentQuestion.burmese}
            </div>
            <div className="text-2xl text-blue-700" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {currentQuestion.devanagari}
            </div>
          </div>
        )}

        {quizType === 'devanagari-to-image' && (
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {currentQuestion.devanagari}
            </div>
          </div>
        )}

        {quizType === 'english-to-burmese' && (
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {currentQuestion.english}
            </div>
          </div>
        )}

        {quizType === 'image-to-burmese' && (
          <div className="flex justify-center">
            <ImageDisplay item={currentQuestion} />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {options.map((opt) => (
          <div key={opt.id} onClick={() => handleAnswer(opt)}>
            {(quizType === 'burmese-to-image' || quizType === 'devanagari-to-image') ? (
              <ImageDisplay 
                item={opt} 
                isCorrect={showResult && opt.id === currentQuestion.id}
                isWrong={showResult && selectedAnswer?.id === opt.id && opt.id !== currentQuestion.id}
              />
            ) : (
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                  showResult && opt.id === currentQuestion.id ? 'border-green-500 border-4 bg-green-50' :
                  showResult && selectedAnswer?.id === opt.id ? 'border-red-500 border-4 bg-red-50' :
                  'border-gray-300 hover:shadow-lg hover:border-gray-400'
                }`}
              >
                <div className="text-xl font-bold" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
                  {opt.burmese}
                </div>
                <div className="text-md text-blue-700 mt-1" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  {opt.devanagari}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result & Next */}
      {showResult && (
        <div className="text-center">
          <div className={`text-2xl font-bold mb-4 ${selectedAnswer?.id === currentQuestion.id ? 'text-green-600' : 'text-red-600'}`}>
            {selectedAnswer?.id === currentQuestion.id ? '✅ Correct!' : `❌ Wrong! It was "${currentQuestion.english}"`}
          </div>
          <button
            onClick={generateQuestion}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition"
          >
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
};

// Flashcard Component
const FlashcardSection = ({ topics, ratings, onRate }) => {
  const [selectedTopic, setSelectedTopic] = useState('fruits');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showBurmese, setShowBurmese] = useState(true);
  const [imageError, setImageError] = useState(false);

  const topic = topics[selectedTopic];
  const items = topic?.items || [];
  const currentItem = items[currentIndex];

  useEffect(() => { setImageError(false); }, [currentItem]);

  const goNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goRandom = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * items.length));
  };

  const handleRate = (ratingId) => {
    onRate(`${topic.id}-${currentItem.id}`, ratingId);
    goNext();
  };

  const currentRating = ratings[`${topic.id}-${currentItem?.id}`];

  if (!currentItem) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <select
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); setCurrentIndex(0); setIsFlipped(false); }}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            {Object.values(topics).map(t => (
              <option key={t.id} value={t.id}>{t.title.english}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showBurmese} 
              onChange={(e) => setShowBurmese(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Show Burmese first</span>
          </label>

          <div className="text-gray-600 font-medium">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="bg-white rounded-2xl shadow-xl p-8 mb-6 min-h-96 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-2xl relative"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Current rating badge */}
        {currentRating && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${RATINGS.find(r => r.id === currentRating)?.color} text-white`}>
            {RATINGS.find(r => r.id === currentRating)?.emoji} {RATINGS.find(r => r.id === currentRating)?.label}
          </div>
        )}

        {(!isFlipped && showBurmese) || (isFlipped && !showBurmese) ? (
          <>
            <div className="text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
              {currentItem.burmese}
            </div>
            <div className="text-3xl text-blue-700" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {currentItem.devanagari}
            </div>
            <div className="mt-8 text-gray-400 text-sm">Tap to reveal</div>
          </>
        ) : (
          <>
            <div className="w-36 h-36 mb-6 flex items-center justify-center">
              {topic.id === 'colours' ? (
                <div className="w-28 h-28 rounded-xl border-4 border-gray-200" style={{ backgroundColor: currentItem.colorCode }} />
              ) : imageError || !currentItem.image ? (
                <div className="text-7xl">📷</div>
              ) : (
                <img
                  src={getImageUrl(topic.id, currentItem.image)}
                  alt={currentItem.english}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-3">
              {currentItem.english}
            </div>
            {!showBurmese && (
              <>
                <div className="text-2xl text-gray-600" style={{ fontFamily: 'Padauk, Myanmar Text, sans-serif' }}>
                  {currentItem.burmese}
                </div>
                <div className="text-xl text-blue-700 mt-1" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  {currentItem.devanagari}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3 mb-6">
        <button onClick={goPrev} className="px-6 py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition font-medium">
          ← Previous
        </button>
        <button onClick={goRandom} className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition font-medium">
          🎲 Random
        </button>
        <button onClick={goNext} className="px-6 py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition font-medium">
          Next →
        </button>
      </div>

      {/* Rating buttons */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="text-center text-sm text-gray-500 mb-3">How well do you know this?</div>
        <div className="flex flex-wrap justify-center gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRate(r.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentRating === r.id 
                  ? r.color + ' text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {r.emoji} {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Progress/Stats Component
const ProgressSection = ({ topics, ratings }) => {
  const stats = {};
  let totalItems = 0;
  let ratedItems = 0;

  Object.values(topics).forEach(topic => {
    stats[topic.id] = { total: topic.items.length, ratings: {} };
    RATINGS.forEach(r => { stats[topic.id].ratings[r.id] = 0; });
    
    topic.items.forEach(item => {
      totalItems++;
      const rating = ratings[`${topic.id}-${item.id}`];
      if (rating) {
        stats[topic.id].ratings[rating]++;
        ratedItems++;
      }
    });
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-6">
            <div 
              className="bg-green-500 h-6 rounded-full transition-all flex items-center justify-center text-white text-sm font-bold"
              style={{ width: `${Math.max((ratedItems/totalItems)*100, 5)}%` }}
            >
              {Math.round((ratedItems/totalItems)*100)}%
            </div>
          </div>
        </div>
        <p className="text-gray-600">{ratedItems} of {totalItems} items rated</p>
      </div>

      {/* Rating Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Rating Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RATINGS.map(r => (
            <div key={r.id} className={`p-3 rounded-lg ${r.color} text-white`}>
              <span className="text-xl mr-2">{r.emoji}</span>
              <span className="font-medium">{r.label}</span>
              <p className="text-sm opacity-90 mt-1">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-topic breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Progress by Topic</h3>
        <div className="space-y-4">
          {Object.values(topics).map(topic => {
            const topicStats = stats[topic.id];
            const rated = Object.values(topicStats.ratings).reduce((a, b) => a + b, 0);
            
            return (
              <div key={topic.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{topic.title.english}</span>
                  <span className="text-sm text-gray-500">{rated}/{topicStats.total}</span>
                </div>
                <div className="flex h-5 rounded-full overflow-hidden bg-gray-200">
                  {RATINGS.map(r => {
                    const count = topicStats.ratings[r.id];
                    const percent = (count / topicStats.total) * 100;
                    return percent > 0 ? (
                      <div 
                        key={r.id}
                        className={r.color}
                        style={{ width: `${percent}%` }}
                        title={`${r.label}: ${count}`}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN APP
// =============================================================================

const KGChartApp = () => {
  const [activeView, setActiveView] = useState('chart');
  const [activeTopic, setActiveTopic] = useState('fruits');
  const [showEnglish, setShowEnglish] = useState(true);
  const [ratings, setRatings] = useState(loadRatings);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    saveRatings(ratings);
  }, [ratings]);

  const handleRate = (key, ratingId) => {
    setRatings(prev => ({ ...prev, [key]: ratingId }));
  };

  const currentTopic = TOPICS_DATA[activeTopic];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Burmese KG Vocabulary Chart</h1>
              <p className="text-green-200 text-sm">Burmese • Devanagari Transliteration • English</p>
            </div>
            
            {/* View Toggles */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'chart', icon: '📊', label: 'Chart' },
                { id: 'quiz', icon: '🎯', label: 'Quiz' },
                { id: 'flashcard', icon: '🃏', label: 'Flashcards' },
                { id: 'progress', icon: '📈', label: 'Progress' },
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === view.id
                      ? 'bg-white text-green-700 shadow'
                      : 'bg-green-600 text-white hover:bg-green-500'
                  }`}
                >
                  {view.icon} {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Topic Nav (for chart view) */}
      {activeView === 'chart' && (
        <TopicNav 
          topics={TOPICS_DATA} 
          activeTopic={activeTopic} 
          onSelect={setActiveTopic} 
        />
      )}

      {/* Controls Bar (for chart view) */}
      {activeView === 'chart' && (
        <div className="bg-white border-b px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-gray-700">Show English labels</span>
            </label>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-8">
        {activeView === 'chart' && currentTopic && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <ChartHeader topic={currentTopic} />
            <VocabGrid
              topic={currentTopic}
              ratings={ratings}
              onRate={handleRate}
              onShowDetail={(item) => setSelectedItem({ item, topic: currentTopic })}
              showEnglish={showEnglish}
            />
          </div>
        )}

        {activeView === 'quiz' && (
          <QuizSection topics={TOPICS_DATA} ratings={ratings} onRate={handleRate} />
        )}

        {activeView === 'flashcard' && (
          <FlashcardSection topics={TOPICS_DATA} ratings={ratings} onRate={handleRate} />
        )}

        {activeView === 'progress' && (
          <ProgressSection topics={TOPICS_DATA} ratings={ratings} />
        )}
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem.item}
          topic={selectedItem.topic}
          rating={ratings[`${selectedItem.topic.id}-${selectedItem.item.id}`]}
          onRate={handleRate}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>KG Vocabulary Learning System • Burmese → Devanagari Transliteration</p>
        </div>
      </footer>
    </div>
  );
};

export default KGChartApp;
