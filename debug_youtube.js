const getYouTubeVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const isYouTubeUrl = (url) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Test your URL
const testUrl = 'https://youtu.be/VVCnWwQwfoU';
const videoId = getYouTubeVideoId(testUrl);

console.log('=== YouTube URL Debug ===');
console.log('Test URL:', testUrl);
console.log('Is YouTube URL?', isYouTubeUrl(testUrl));
console.log('Extracted Video ID:', videoId);
console.log('Video ID length:', videoId ? videoId.length : 'null');
console.log('Is valid ID?', videoId && videoId.length === 11);
console.log('Expected thumbnail:', videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'N/A');

// Test the regex parts
const match = testUrl.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
console.log('\n=== Regex Match Debug ===');
console.log('Full match:', match);
if (match) {
  console.log('Match[7] (video ID):', match[7]);
  console.log('All matches:', match.map((m, i) => `${i}: ${m}`));
}