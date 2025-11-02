document.addEventListener("DOMContentLoaded", () => {
  const noteTextarea = document.getElementById("noteTextarea");
  const addButton = document.getElementById("addButton");
  const colorPicker = document.getElementById("colorPicker");
  const notesContainer = document.getElementById("notesContainer");
  const filterInput = document.getElementById("filterInput");

  let selectedColor = "#D7E0FF"; // Varsayılan renk

  // Not yapısı: { id: Date.now(), text: '...', color: '#...' }
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  // --- Fonksiyonlar ---

  // Notları Local Storage'a kaydeder
  const saveNotes = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  // Notları DOM'a çizer
  const renderNotes = (noteList) => {
    notesContainer.innerHTML = ""; // Mevcut notları temizle

    // Notları görseldeki gibi tersten (son ekleneni başta) listele
    noteList
      .slice()
      .reverse()
      .forEach((note) => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";
        noteItem.style.backgroundColor = note.color;
        noteItem.textContent =
          note.text.length > 20
            ? note.text.substring(0, 20) + "..."
            : note.text; // Kısaltılmış metin
        noteItem.setAttribute("title", note.text); // Tam metni tooltipe ekle

        // Görseldeki gibi "Note 1, Note 2, ..." şeklinde başlıklandırma için
        // Bu kısım, notun sırasını bulmak için biraz karmaşık olabilir,
        // Bu örnekte notun kendisinin ilk 20 karakterini kullanıyoruz.

        // Notun detayını görmek için tıklama (opsiyonel)
        noteItem.addEventListener("click", () => {
          alert(
            `Not:\n\n${note.text}\n\n(Notu silmek için not metnine çift tıklayın.)`
          );
        });

        // Notu silme (Çift tıklama ile)
        noteItem.addEventListener("dblclick", () => {
          if (confirm("Bu notu silmek istediğinizden emin misiniz?")) {
            notes = notes.filter((n) => n.id !== note.id);
            saveNotes();
            renderNotes(notes);
          }
        });

        notesContainer.appendChild(noteItem);
      });
  };

  // Yeni not ekler
  const addNote = () => {
    const text = noteTextarea.value.trim();
    if (text === "") {
      alert("Lütfen bir not girin!");
      return;
    }

    const newNote = {
      id: Date.now(),
      text: text,
      color: selectedColor,
    };

    notes.push(newNote);
    saveNotes();
    noteTextarea.value = ""; // Alanı temizle
    renderNotes(notes); // Notları yeniden çiz
  };

  // --- Olay Dinleyicileri ---

  // Ekle butonuna tıklama
  addButton.addEventListener("click", addNote);

  // Renk seçimi
  colorPicker.addEventListener("click", (e) => {
    if (e.target.classList.contains("color-option")) {
      // Önceki seçili olanı kaldır
      document.querySelectorAll(".color-option").forEach((opt) => {
        opt.classList.remove("selected");
      });

      // Yeni seçileni ayarla
      e.target.classList.add("selected");
      selectedColor = e.target.getAttribute("data-color");
    }
  });

  // Filtreleme (Arama)
  filterInput.addEventListener("input", () => {
    const filterText = filterInput.value.toLowerCase().trim();
    const filteredNotes = notes.filter((note) =>
      note.text.toLowerCase().includes(filterText)
    );
    renderNotes(filteredNotes);
  });

  // Uygulama yüklendiğinde notları göster
  renderNotes(notes);
});
