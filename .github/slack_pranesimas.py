"""Slack žinutė apie krei.lt pakeitimą (kviečia .github/workflows/atkurimo-taskas.yml)."""
import json, os, re, urllib.request

ev = json.load(open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8"))
repo = os.environ["GITHUB_REPOSITORY"]
lines, paths = [], set()
for c in ev.get("commits", []):
    subj = c["message"].splitlines()[0]
    who = (re.search(r"^autorius: (.+)$", c["message"], re.M) or [None, c["author"]["name"]])[1]
    lines.append(f"• {subj} ({who}) <{c['url']}|{c['id'][:7]}>")
    for p in c.get("added", []) + c.get("modified", []) + c.get("removed", []):
        paths.add(p.split("/")[0] + ("/" if "/" in p else ""))
text = ":globe_with_meridians: *krei.lt atnaujinta*\n" + "\n".join(lines[-10:])
if paths:
    text += "\nPaliesta: " + ", ".join(sorted(paths)[:12])
text += f"\nAtkūrimo taškas: `{os.environ.get('TAG', '?')}` · atšaukti: `python3 grazinti.py paskutini` · gyvai po ~1 min."
req = urllib.request.Request("https://slack.com/api/chat.postMessage",
                             data=json.dumps({"channel": os.environ["SLACK_CHANNEL"], "text": text, "unfurl_links": False}).encode(),
                             headers={"Authorization": "Bearer " + os.environ["SLACK_BOT_TOKEN"], "Content-Type": "application/json; charset=utf-8"})
r = json.load(urllib.request.urlopen(req, timeout=20))
print(r.get("ok"), r.get("error"))
