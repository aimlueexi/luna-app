import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

type Film = {
  title: string;
  english: string;
  genre: string;
  year: string;
  duration: string;
  score: string;
  image: string;
  description: string;
};

const films: Film[] = [
  {
    title: '月球之外', english: 'BEYOND THE MOON', genre: '科幻 · 冒险', year: '2026', duration: '2小时 08分', score: '9.2',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1100&q=85',
    description: '一次意外的信号，让失联十年的深空飞船重新出现在地球轨道。年轻的天文台研究员林月，决定追随这束微光，寻找父亲留下的最后答案。',
  },
  {
    title: '最后一场日落', english: 'THE LAST SUNSET', genre: '剧情 · 爱情', year: '2025', duration: '1小时 52分', score: '8.8',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85',
    description: '在海边小镇的最后一个夏天，一位摄影师重返故乡，重新拾起错过的时光与未说出口的告别。',
  },
  {
    title: '雾中来信', english: 'LETTERS IN THE FOG', genre: '悬疑 · 剧情', year: '2026', duration: '1小时 46分', score: '8.6',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85',
    description: '一封封迟到的信件，将小镇邮差带入一桩尘封多年的失踪案。雾散之前，所有人都藏着一个秘密。',
  },
  {
    title: '夜航者', english: 'NIGHT VOYAGERS', genre: '科幻 · 惊悚', year: '2025', duration: '2小时 01分', score: '8.9',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
    description: '一架没有目的地的夜航班机，载着乘客驶入一片从未被记录过的星空。',
  },
];
const categories = ['为你推荐', '电影', '剧集', '纪录片'];
const tabs = [
  { id: 'home', icon: '⌂', label: '首页' },
  { id: 'search', icon: '⌕', label: '探索' },
  { id: 'library', icon: '▤', label: '片单' },
  { id: 'profile', icon: '◉', label: '我的' },
];
const sampleVideo = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

function Player({ onClose, film }: { onClose: () => void; film: Film }) {
  const player = useVideoPlayer(sampleVideo, (instance) => { instance.loop = false; instance.play(); });
  return (
    <View style={styles.playerScreen}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls allowsFullscreen allowsPictureInPicture />
      <SafeAreaView style={styles.playerChrome}>
        <Pressable accessibilityRole="button" accessibilityLabel="关闭播放器" onPress={onClose} style={styles.roundButton}><Text style={styles.roundButtonText}>×</Text></Pressable>
        <View style={styles.playerTitle}><Text style={styles.kicker}>LUNA ORIGINAL</Text><Text style={styles.playerFilm}>{film.title}</Text><Text style={styles.muted}>试看片段 · 视频源为演示素材</Text></View>
      </SafeAreaView>
    </View>
  );
}

function Poster({ film, onPress }: { film: Film; onPress: () => void }) {
  return (
    <Pressable style={styles.poster} onPress={onPress} accessibilityRole="button" accessibilityLabel={`查看《${film.title}》详情`}>
      <Image source={{ uri: film.image }} style={styles.posterImage} />
      <View style={styles.score}><Text style={styles.scoreText}>★ {film.score}</Text></View>
      <Text numberOfLines={1} style={styles.posterTitle}>{film.title}</Text>
      <Text numberOfLines={1} style={styles.posterMeta}>{film.year}　{film.genre}</Text>
    </Pressable>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Film | null>(null);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const results = useMemo(() => films.filter((film) => `${film.title} ${film.english} ${film.genre}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  const toggleSaved = (film: Film) => setSaved((items) => items.includes(film.title) ? items.filter((title) => title !== film.title) : [...items, film.title]);
  const openFilm = (film: Film) => setSelected(film);
  const startPlayback = () => { setPlaying(true); };

  if (playing && selected) return <><StatusBar hidden /><Player film={selected} onClose={() => setPlaying(false)} /></>;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.app}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {selected ? (
            <View style={styles.detail}>
              <ImageBackground source={{ uri: selected.image }} style={styles.detailArt} imageStyle={styles.detailImage}>
                <Pressable style={styles.roundButton} onPress={() => setSelected(null)}><Text style={styles.roundButtonText}>×</Text></Pressable>
                <View style={styles.detailBadge}><Text style={styles.kicker}>LUNA ORIGINAL</Text></View>
              </ImageBackground>
              <Text style={styles.filmTitle}>{selected.title}</Text>
              <Text style={styles.english}>{selected.english}</Text>
              <Text style={styles.meta}>{selected.year}  ·  {selected.genre}  ·  4K  ·  ★ {selected.score}</Text>
              <Text style={styles.description}>{selected.description}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.playButton} onPress={startPlayback}><Text style={styles.playButtonText}>▶  播放预览</Text></Pressable>
                <Pressable style={styles.saveButton} onPress={() => toggleSaved(selected)}><Text style={styles.saveText}>{saved.includes(selected.title) ? '✓' : '+'}</Text></Pressable>
              </View>
              <View style={styles.episodeBox}><Text style={styles.sectionTitle}>播放说明</Text><Text style={styles.muted}>当前播放器接入演示片段。正式上线前请配置合法授权的视频地址、HLS 清单及字幕资源。</Text></View>
            </View>
          ) : tab === 'home' ? (
            <>
              <View style={styles.topbar}><View style={styles.brand}><Text style={styles.brandGlyph}>✦</Text><Text style={styles.brandName}>luna</Text></View><Pressable onPress={() => setTab('search')} style={styles.searchButton}><Text style={styles.searchGlyph}>⌕</Text></Pressable></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>{categories.map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={styles.categoryButton}><Text style={[styles.categoryText, category === item && styles.categoryActive]}>{item}</Text>{category === item && <View style={styles.categoryLine} />}</Pressable>)}</ScrollView>
              <ImageBackground source={{ uri: films[0].image }} style={styles.hero} imageStyle={styles.heroImage}>
                <View style={styles.heroShade} /><View style={styles.heroTop}><Text style={styles.kicker}>LUNA ORIGINAL</Text><Text style={styles.heroIndex}>01　/　04</Text></View>
                <View style={styles.heroCopy}><Text style={styles.eyebrow}>✦  本周独家首映</Text><Text style={styles.heroTitle}>月球之外</Text><Text style={styles.english}>BEYOND THE MOON</Text><Text style={styles.meta}>2026  ·  科幻 · 冒险  ·  4K</Text><View style={styles.actions}><Pressable style={styles.playButton} onPress={() => { setSelected(films[0]); startPlayback(); }}><Text style={styles.playButtonText}>▶  播放预览</Text></Pressable><Pressable style={styles.saveButton} onPress={() => toggleSaved(films[0])}><Text style={styles.saveText}>{saved.includes(films[0].title) ? '✓' : '+'}</Text></Pressable></View></View>
              </ImageBackground>
              <View style={styles.section}><View style={styles.sectionHeading}><View><Text style={styles.kicker}>PICK UP WHERE YOU LEFT OFF</Text><Text style={styles.sectionTitle}>继续观看</Text></View><Text style={styles.muted}>全部　›</Text></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.continueRail}>{films.slice(1, 3).map((film, index) => <Pressable key={film.title} style={styles.continueCard} onPress={() => openFilm(film)}><Image source={{ uri: film.image }} style={styles.continueImage} /><View style={styles.continueCopy}><Text style={styles.continueTitle}>{film.title}</Text><Text style={styles.muted}>第 {index + 2} 集 · 还剩 {28 + index * 18} 分钟</Text><View style={styles.progress}><View style={[styles.progressFill, { width: index ? '38%' : '61%' }]} /></View></View></Pressable>)}</ScrollView>
              </View>
              <View style={styles.section}><View style={styles.sectionHeading}><View><Text style={styles.kicker}>CURATED FOR YOUR NIGHT</Text><Text style={styles.sectionTitle}>{category === categories[0] ? '今夜精选' : category === '电影' ? '好电影' : category === '剧集' ? '口碑剧集' : '沉浸纪录'}</Text></View><Pressable onPress={() => setTab('search')}><Text style={styles.muted}>探索　›</Text></Pressable></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.posterRail}>{films.slice(1).map((film) => <Poster key={film.title} film={film} onPress={() => openFilm(film)} />)}</ScrollView></View>
              <View style={styles.editorial}><Text style={styles.editorialStar}>✧</Text><View style={styles.editorialCopy}><Text style={styles.body}>今晚，留给好故事</Text><Text style={styles.muted}>Curated by luna</Text></View><Text style={styles.gold}>→</Text></View>
            </>
          ) : tab === 'search' ? (
            <><View style={styles.topbar}><View style={styles.brand}><Text style={styles.brandGlyph}>✦</Text><Text style={styles.brandName}>luna</Text></View><Text style={styles.meta}>探索</Text></View><View style={styles.searchField}><Text style={styles.searchGlyph}>⌕</Text><TextInput accessibilityLabel="搜索影片、演员或类型" value={query} onChangeText={setQuery} placeholder="搜索影片、演员或类型" placeholderTextColor={colors.muted} style={styles.searchInput} returnKeyType="search" /><Pressable onPress={() => setQuery('')}><Text style={styles.muted}>×</Text></Pressable></View><View style={styles.sectionHeading}><View><Text style={styles.kicker}>FIND YOUR NEXT STORY</Text><Text style={styles.sectionTitle}>{query ? '搜索结果' : '热门搜索'}</Text></View><Text style={styles.muted}>{String(results.length).padStart(2, '0')}</Text></View>{!query && <View style={styles.terms}>{['科幻', '治愈', '悬疑', '公路电影'].map((term) => <Pressable key={term} onPress={() => setQuery(term)} style={styles.term}><Text style={styles.body}>{term}　↗</Text></Pressable>)}</View>}{results.length ? results.map((film) => <Pressable key={film.title} style={styles.resultRow} onPress={() => openFilm(film)}><Image source={{ uri: film.image }} style={styles.resultImage} /><View style={styles.resultCopy}><Text style={styles.body}>{film.title}</Text><Text style={styles.muted}>{film.year} · {film.genre} · {film.duration}</Text></View><Text style={styles.gold}>★ {film.score}</Text></Pressable>) : <View style={styles.empty}><Text style={styles.body}>还没有找到这部影片</Text><Text style={styles.muted}>试试片名、类型或英文名</Text></View>}</>
          ) : tab === 'library' ? (
            <><View style={styles.topbar}><View style={styles.brand}><Text style={styles.brandGlyph}>✦</Text><Text style={styles.brandName}>luna</Text></View><Text style={styles.meta}>我的片单</Text></View><View style={styles.libraryIntro}><Text style={styles.kicker}>YOUR PRIVATE CINEMA</Text><Text style={styles.libraryTitle}>留给以后{'\n'}<Text style={styles.gold}>慢慢看。</Text></Text><Text style={styles.muted}>收藏那些值得留在心里的故事。</Text></View>{films.filter((film) => saved.includes(film.title)).length ? films.filter((film) => saved.includes(film.title)).map((film) => <Pressable key={film.title} style={styles.resultRow} onPress={() => openFilm(film)}><Image source={{ uri: film.image }} style={styles.resultImage} /><View style={styles.resultCopy}><Text style={styles.body}>{film.title}</Text><Text style={styles.muted}>{film.year} · {film.genre}</Text></View><Text style={styles.gold}>▤</Text></Pressable>) : <View style={styles.empty}><Text style={styles.emptyIcon}>▤</Text><Text style={styles.body}>你的片单还是空的</Text><Text style={styles.muted}>遇见喜欢的故事，就把它收藏起来。</Text><Pressable style={styles.outlineButton} onPress={() => setTab('home')}><Text style={styles.gold}>去发现影片　↗</Text></Pressable></View>}</>
          ) : (
            <><View style={styles.topbar}><View style={styles.brand}><Text style={styles.brandGlyph}>✦</Text><Text style={styles.brandName}>luna</Text></View></View><View style={styles.profile}><View style={styles.profileOrb}><Text style={styles.gold}>◉</Text></View><Text style={styles.kicker}>A LITTLE SPACE FOR YOU</Text><Text style={styles.profileTitle}>晚上的好时光，{'\n'}<Text style={styles.gold}>从这里开始。</Text></Text><Pressable style={styles.signin}><Text style={styles.signinText}>登录 / 创建账户　　→</Text></Pressable><View style={styles.profileLinks}><Text style={styles.profileLink}>观看偏好　›</Text><Text style={styles.profileLink}>播放设置　›</Text><Text style={styles.profileLink}>关于 luna　›</Text></View></View></>
          )}
        </ScrollView>
        {!selected && <View style={styles.bottomNav}>{tabs.map((item) => <Pressable key={item.id} style={styles.navItem} onPress={() => { setSelected(null); setTab(item.id); }}><Text style={[styles.navIcon, tab === item.id && styles.navActive]}>{item.icon}</Text><Text style={[styles.navLabel, tab === item.id && styles.navActive]}>{item.label}</Text></Pressable>)}</View>}
      </View>
    </SafeAreaView>
  );
}

const colors = { bg: '#090a10', panel: '#13141b', line: 'rgba(255,255,255,0.1)', gold: '#e8d5ad', muted: '#a09fac', text: '#f1f0f2' };
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg }, app: { flex: 1, backgroundColor: colors.bg }, scrollContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 120 },
  topbar: { height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 8 }, brandGlyph: { color: colors.gold, fontSize: 20 }, brandName: { color: colors.text, fontSize: 21, fontWeight: '600', letterSpacing: 1 },
  searchButton: { width: 38, height: 38, borderRadius: 22, backgroundColor: '#20212a', alignItems: 'center', justifyContent: 'center' }, searchGlyph: { color: colors.text, fontSize: 26, lineHeight: 29 }, categoryRail: { gap: 22, height: 45, alignItems: 'center', paddingRight: 18 }, categoryButton: { height: 40, justifyContent: 'center' }, categoryText: { color: '#8b8b96', fontSize: 13 }, categoryActive: { color: colors.text }, categoryLine: { height: 2, marginTop: 6, backgroundColor: colors.gold, borderRadius: 2 },
  hero: { height: 390, marginHorizontal: -22, padding: 20, justifyContent: 'space-between', overflow: 'hidden' }, heroImage: { resizeMode: 'cover' }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,4,8,0.35)' }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, kicker: { color: '#c9b78e', fontSize: 10, fontWeight: '700', letterSpacing: 2 }, heroIndex: { color: '#eee', fontSize: 10, letterSpacing: 2 }, heroCopy: { marginBottom: 2 }, eyebrow: { color: colors.gold, fontSize: 11, marginBottom: 10 }, heroTitle: { color: '#fff', fontSize: 38, fontWeight: '600' }, english: { color: '#c4c0c4', fontSize: 10, letterSpacing: 2.1, marginTop: 5, marginBottom: 12 }, meta: { color: '#c7c4cc', fontSize: 11 }, actions: { flexDirection: 'row', gap: 10, marginTop: 18, alignItems: 'center' }, playButton: { height: 44, backgroundColor: '#eee4cf', borderRadius: 7, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, flex: 1 }, playButtonText: { color: '#16130d', fontSize: 13, fontWeight: '700' }, saveButton: { width: 44, height: 44, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, saveText: { fontSize: 24, color: '#fff', lineHeight: 27 },
  section: { marginTop: 25 }, sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }, sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '600', marginTop: 4 }, muted: { color: colors.muted, fontSize: 11 }, continueRail: { gap: 14, paddingRight: 22 }, continueCard: { flexDirection: 'row', width: 285, alignItems: 'center', gap: 11 }, continueImage: { width: 126, height: 76, borderRadius: 6, backgroundColor: colors.panel }, continueCopy: { flex: 1, gap: 6 }, continueTitle: { color: colors.text, fontSize: 13 }, progress: { height: 2, borderRadius: 3, backgroundColor: '#41414a', marginTop: 4 }, progressFill: { height: 2, borderRadius: 3, backgroundColor: colors.gold }, posterRail: { gap: 12, paddingRight: 22 }, poster: { width: 112 }, posterImage: { width: 112, height: 151, borderRadius: 6, backgroundColor: colors.panel }, score: { position: 'absolute', top: 128, right: 6 }, scoreText: { color: '#f5e8ce', fontSize: 10 }, posterTitle: { marginTop: 8, color: '#e8e7ea', fontSize: 12 }, posterMeta: { marginTop: 4, color: colors.muted, fontSize: 10 }, editorial: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, marginTop: 27, paddingVertical: 13, gap: 12 }, editorialStar: { color: colors.gold, fontSize: 20 }, editorialCopy: { flex: 1, gap: 3 }, body: { color: '#dedce3', fontSize: 13 }, gold: { color: colors.gold, fontSize: 13 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 76, borderTopWidth: 1, borderColor: colors.line, backgroundColor: '#0c0d13', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }, navItem: { width: 64, alignItems: 'center', gap: 3 }, navIcon: { color: '#a3a2ad', fontSize: 22, height: 26 }, navLabel: { color: '#a3a2ad', fontSize: 10 }, navActive: { color: colors.gold },
  searchField: { height: 48, borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.panel, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, marginBottom: 22 }, searchInput: { color: colors.text, flex: 1, fontSize: 14 }, terms: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }, term: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, borderWidth: 1, borderColor: colors.line }, resultRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.line }, resultImage: { width: 58, height: 68, borderRadius: 5 }, resultCopy: { flex: 1, gap: 6 },
  libraryIntro: { paddingVertical: 36 }, libraryTitle: { color: colors.text, fontSize: 31, lineHeight: 44, marginVertical: 13 }, empty: { minHeight: 260, alignItems: 'center', justifyContent: 'center', gap: 12 }, emptyIcon: { color: colors.gold, fontSize: 26, marginBottom: 5 }, outlineButton: { borderWidth: 1, borderColor: colors.line, borderRadius: 7, padding: 13, marginTop: 8 }, profile: { paddingTop: 95 }, profileOrb: { width: 54, height: 54, borderWidth: 1, borderColor: '#554934', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 25 }, profileTitle: { color: colors.text, fontSize: 27, lineHeight: 40, marginTop: 17 }, signin: { backgroundColor: colors.gold, padding: 16, borderRadius: 6, marginVertical: 24 }, signinText: { color: '#17140e', fontWeight: '600' }, profileLinks: { borderTopWidth: 1, borderColor: colors.line }, profileLink: { paddingVertical: 17, color: '#c3c1c8', borderBottomWidth: 1, borderColor: colors.line },
  detail: { marginHorizontal: -22 }, detailArt: { height: 410, padding: 18, justifyContent: 'space-between' }, detailImage: { resizeMode: 'cover' }, roundButton: { width: 36, height: 36, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }, roundButtonText: { color: '#fff', fontSize: 27, lineHeight: 30 }, detailBadge: { alignItems: 'flex-start' }, filmTitle: { color: colors.text, fontSize: 30, fontWeight: '600', marginHorizontal: 23, marginTop: 15 }, description: { color: '#c2c0c9', fontSize: 13, lineHeight: 22, marginHorizontal: 23, marginTop: 16 }, episodeBox: { marginHorizontal: 23, marginTop: 24, gap: 8 }, playerScreen: { flex: 1, backgroundColor: '#050609' }, playerChrome: { flex: 1, justifyContent: 'space-between', padding: 18 }, playerTitle: { marginBottom: 22, gap: 8 }, playerFilm: { color: '#fff', fontSize: 22, fontWeight: '600' },
});
