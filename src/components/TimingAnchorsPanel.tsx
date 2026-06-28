import type { TimingAnchor } from "../types/meta";
import { useEditorStore } from "../store/useEditorStore";
import { beatToTick, formatTick, RESOLUTION } from "../utils/resolution";
import { bpmAtAnchor, sortTimingAnchors } from "../utils/timing";

export function TimingAnchorsPanel({ embedded = false }: { embedded?: boolean }) {
  const {
    meta,
    placementMode,
    updateAnchor,
    addAnchor,
    addAnchorAtPlayhead,
    removeAnchor,
    setPlacementMode,
  } = useEditorStore();

  const anchors = sortTimingAnchors(meta.SongTiming);
  const placing = placementMode === "anchor";

  const togglePlaceOnGrid = () => {
    setPlacementMode(placing ? null : "anchor");
  };

  const content = (
    <>
      <button
        className={`btn btn-accent placement-btn${placing ? " is-active" : ""}`}
        type="button"
        onClick={togglePlaceOnGrid}
      >
        {placing ? "Placing…" : "Place on grid"}
      </button>

      <ul className="phase-list anchor-list">
        {anchors.map((anchor, index) => (
          <AnchorItem
            key={`${anchor.beat}-${anchor.timer}-${index}`}
            anchor={anchor}
            index={index}
            anchors={anchors}
            canRemove={anchors.length > 2}
            onUpdate={(patch) => updateAnchor(index, patch)}
            onRemove={() => removeAnchor(index)}
          />
        ))}
      </ul>

      <div className="btn-group phase-actions">
        <button className="btn" type="button" onClick={addAnchor}>
          Add
        </button>
        <button className="btn btn-accent" type="button" onClick={addAnchorAtPlayhead}>
          At playhead
        </button>
      </div>
    </>
  );

  if (embedded) {
    return <div className="tab-content">{content}</div>;
  }

  return (
    <section className="panel">
      <h3>Timing Anchors</h3>
      <p className="hint">Beat/time sync — exported in [SyncTrack]</p>
      {content}
    </section>
  );
}

function AnchorItem({
  anchor,
  index,
  anchors,
  canRemove,
  onUpdate,
  onRemove,
}: {
  anchor: TimingAnchor;
  index: number;
  anchors: TimingAnchor[];
  canRemove: boolean;
  onUpdate: (patch: Partial<TimingAnchor>) => void;
  onRemove: () => void;
}) {
  const tick = beatToTick(anchor.beat);
  const bpm =
    index < anchors.length - 1
      ? Math.round(bpmAtAnchor(anchors, index) * 10) / 10
      : null;

  return (
    <li className="phase-item anchor-item">
      <div className="phase-item-head">
        <span className="anchor-badge">Tick {formatTick(tick)}</span>
        <button
          className="phase-remove"
          type="button"
          title="Remove anchor"
          disabled={!canRemove}
          onClick={onRemove}
        >
          ×
        </button>
      </div>

      <div className="phase-fields-row">
        <label>
          Beat
          <input
            type="number"
            min={0}
            step={1 / RESOLUTION}
            value={anchor.beat}
            onChange={(e) => onUpdate({ beat: Math.max(0, Number(e.target.value)) })}
          />
        </label>
        <label>
          Time (s)
          <input
            type="number"
            min={0}
            step={0.001}
            value={anchor.timer}
            onChange={(e) => onUpdate({ timer: Math.max(0, Number(e.target.value)) })}
          />
        </label>
      </div>

      {bpm !== null && (
        <p className="hint anchor-meta hint-inline">{bpm} BPM → next</p>
      )}
    </li>
  );
}