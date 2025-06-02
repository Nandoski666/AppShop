  cargarTransacciones(): void {
    this.http.get<any[]>(`${this.transaccionesUrl}/getAll`).subscribe({
      next: (data) => {
        console.log('Transacciones recibidas:', data);
        // Adaptar si los campos vienen con nombres distintos
        this.transacciones = data.map(tx => ({
          id: tx.id ?? tx.idTransaccion ?? '',
          identificacion: tx.identificacion ?? tx.usuario ?? tx.cliente ?? '',
          fechaHora: tx.fechaHora ?? tx.fecha ?? tx.fechaTransaccion ?? '',
          estado: tx.estado ?? tx.status ?? '',
          valorTx: tx.valorTx ?? tx.valor ?? tx.monto ?? 0
        }));
      },
      error: (error) => {
        alert('No se pudieron cargar las transacciones.');
      }
    });
  } 