
<div class="card shadow mb-4">
  <div class="card-header py-3">Abrir caja</div>
  <div class="card-body">
    <?php if (validation_errors()) { ?>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <?php echo validation_errors('<li>', '</li>'); ?>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    <?php } ?>

    <?= form_open() ?>

    <div class="form-row">
      <div class="form-group col-6">
        <label class="small mb-1" for="inputUsername">Nombre de la caja</label>
        <input class="form-control" id="name" type="text" name="name" placeholder="Nombre de la caja" value="<?=$name??"caja"?>" required readonly="readonly">
      </div>
      <div class="form-group col-md-6">
      <label class="small mb-1" for="inputUsername">Selecciona una moneda</label>
        <div class="input-group mb-6">
          <div class="input-group-prepend">
            <label class="input-group-text" for="inputGroupSelect01">$</label>
          </div>
          <select class="custom-select" id="coin_id" name="coin_id" required>
            <?php foreach($coins as $coin) :?>
              <option value="<?=$coin->id?>" selected><?=$coin->name.' ('.$coin->short_name.', '.$coin->symbol.')'?></option>
            <?php endforeach?>
          </select>
        </div>
      </div>
    </div>

    <div class="form-row">

      <div class="form-group col-md-6">
        <label class="small mb-1" for="inputUsername">Monto de apertura</label>
        <input class="form-control" id="mount" type="number" name="mount" min="1" required>
      </div>
      <div class="form-group col-md-6">
        <label class="small mb-1" for="exampleFormControlTextarea1">Descripción del monto</label>
        <input class="form-control" id="description" type="text" name="description" value="Por apertura de caja" required>
      </div>
    </div>

    <button class="btn btn-primary" type="submit">Abrir caja</button>
    <a href="<?php echo site_url('admin/cashregister'); ?>" class="btn btn-dark">Cancelar</a>

    <?php echo form_close() ?>
  </div>
</div>