export default function LeadTimeline({ activities = [], notes = [], followUps = [] }) {
  return (
    <div className="adminTimelineGrid">
      <section>
        <h2>Activity Timeline</h2>
        {activities.length ? activities.map((activity) => (
          <article key={activity.id || `${activity.activity_type}-${activity.created_at}`}>
            <strong>{activity.activity_type}</strong>
            <p>{activity.summary}</p>
            <span>{activity.created_at ? new Date(activity.created_at).toLocaleString() : ""}</span>
          </article>
        )) : <p>No activities yet.</p>}
      </section>
      <section>
        <h2>Staff Notes</h2>
        {notes.length ? notes.map((note) => (
          <article key={note.id}>
            <p>{note.note}</p>
            <span>{note.created_by} · {new Date(note.created_at).toLocaleString()}</span>
          </article>
        )) : <p>No notes yet.</p>}
      </section>
      <section>
        <h2>Follow-Ups</h2>
        {followUps.length ? followUps.map((item) => (
          <article key={item.id}>
            <strong>{item.status}</strong>
            <p>{item.outcome || "Follow-up scheduled"}</p>
            <span>{new Date(item.due_at).toLocaleString()}</span>
          </article>
        )) : <p>No follow-ups set.</p>}
      </section>
    </div>
  );
}
