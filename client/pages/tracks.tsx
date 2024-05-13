
// Stub out the structure of this page.
// Requirements:
/*
	1. Make a fetch GET request to retrieve track listings.
	2. Render the list of tracks, and include a link or player control
		2A - anchor link to the file itself, taking the user to the file in a new window (browser media player)
		2B - player control accessing the file based on its stored path/name and playable inline. 
	3. [...]
		whaT else

*/


<div className="files-display">
{ 
  files && filesList > 0
  ? files.map((t, i) => (
    <div className="files" key={i}>
        <div className="files-title">{t.vchTitle}</div>
        <div className="files-size">{t.txtSize}</div>
        <div className="files-description">{t.vchAudioUrl}</div>
        <div className="files-genre">{t.vchArtist}</div>
    </div>
  ))
: <div></div>
}
</div>