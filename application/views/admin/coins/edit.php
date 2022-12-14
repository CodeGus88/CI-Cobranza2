<div class="card shadow mb-4">
  <div class="card-header py-3"><?php echo empty($coin->name) ? 'Nueva moneda' : 'Editar moneda'; ?> </div>
  <div class="card-body">
    <?php if (validation_errors()) { ?>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <?php echo validation_errors('<li>', '</li>'); ?>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    <?php } ?>

    <?php echo form_open(); ?>

    <div class="form-row">
      <div class="form-group col-md-6">
        <label class="small mb-1" for="name">Ingresar moneda</label>
        <input class="form-control" id="name" type="text" name="name" value="<?php echo set_value('name', $this->input->post('name') ? $this->input->post('name') : $coin->name); ?>" placeholder="Ejm: Dolar">
      </div>
      <div class="form-group col-md-6">
        <label class="small mb-1" for="short_name">Ingresar abreviatura</label>
        <input class="form-control" style="text-transform:uppercase;" id="short_name" type="text" name="short_name" value="<?php echo set_value('short_name', $this->input->post('short_name') ? $this->input->post('short_name') : $coin->short_name); ?>" placeholder="Ejm: USD">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-md-6">
        <label class="small mb-1" for="symbol">Ingresar simbolo</label>
        <input class="form-control" style="text-transform:uppercase;" id="symbol" type="text" name="symbol" value="<?php echo set_value('symbol', $this->input->post('symbol') ? $this->input->post('symbol') : $coin->symbol); ?>" placeholder="Ejm: $">
      </div>
      <div class="form-group col-md-6">
        <label class="small mb-1" for="description">Ingresar descripcion</label>
        <input class="form-control" id="description" type="text" name="description" value="<?php echo set_value('description', $this->input->post('description') ? $this->input->post('description') : $coin->description); ?>" placeholder="Ejm: Dolar estadounidense">
      </div>
    </div>
    <div class="float-right">
      <a href="<?php echo site_url('admin/coins/'); ?>" class="btn btn-dark">Cancelar</a>
      <button class="btn btn-primary" type="submit">Registrar moneda</button>
    </div>
    <?php echo form_close() ?>
  </div>
</div>