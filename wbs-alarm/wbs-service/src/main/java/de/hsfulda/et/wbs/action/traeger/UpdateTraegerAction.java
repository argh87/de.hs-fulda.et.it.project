package de.hsfulda.et.wbs.action.traeger;

import de.hsfulda.et.wbs.core.data.TraegerData;
import de.hsfulda.et.wbs.core.data.TraegerDto;

public interface UpdateTraegerAction {

    TraegerData perform(Long id, TraegerDto traeger);
}