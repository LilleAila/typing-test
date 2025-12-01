# Typing test survey

1. Hvilken klasse går du i?
2. Bruker du touch metoden?
3. Hvor lenge har du brukt den?
   - Flere år
   - Ett år
   - Et halvt år
   - Mindre enn et halvt år
4. Spiller du et instrument?
5. Legge til stats hentet automatisk

## Architecture

Frontend: Static HTML/JS
Backend: Pocketbase

## TODO

- [ ] Pocketbase backend
- [ ] Vurdere om norsk eller engelsk
- [ ] Session tokens.
  - Store a session token and a completed-status in localStorage
  - Pocketbase denies create if a record already exists with that token
  - Frontend does not allow submitting if it is already completed
