with import <nixpkgs> {}; mkShell {
  packages = [
    typescript-language-server
    prettier
    pocketbase
    python3
  ];
}
